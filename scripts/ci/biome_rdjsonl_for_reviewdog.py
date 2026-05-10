#!/usr/bin/env python3

from __future__ import annotations

import difflib
import json
import subprocess
import sys
from pathlib import Path

MAX_MESSAGE_CHARS = 45000
TRUNCATION_NOTE = "\n(diff truncated for GitHub comment limit; run biome locally for the full preview)"
FORMAT_STUB = "Formatter would have printed the following content"


def _normalize_path(raw: str) -> str:
    return raw.replace("\\", "/")


def _clamp_line(value: object) -> int:
    if isinstance(value, int) and value >= 1:
        return value
    return 1


def _clamp_column(value: object) -> int:
    if isinstance(value, int) and value >= 1:
        return value
    return 1


def _severity(raw: object) -> str:
    if raw == "error":
        return "ERROR"
    if raw == "warning":
        return "WARNING"
    return "INFO"


def _is_format_diagnostic(diagnostic: dict[str, object]) -> bool:
    if diagnostic.get("category") == "format":
        return True
    message = diagnostic.get("message")
    return isinstance(message, str) and FORMAT_STUB in message


def _format_stdout(repo_root: Path, rel_posix: str) -> str | None:
    result = subprocess.run(
        ["pnpm", "exec", "biome", "format", rel_posix],
        cwd=repo_root,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        err = (result.stderr or "").strip()
        if err:
            print(f"biome format {rel_posix}: {err}", file=sys.stderr)
        return None
    return result.stdout


def _unified_diff(rel_posix: str, original: str, formatted: str) -> str:
    a = original.splitlines(keepends=True)
    b = formatted.splitlines(keepends=True)
    lines = difflib.unified_diff(
        a,
        b,
        fromfile=f"a/{rel_posix}",
        tofile=f"b/{rel_posix}",
        lineterm="",
    )
    return "\n".join(lines)


def _append_diff_block(message: str, diff_text: str) -> str:
    if not diff_text.strip():
        return message
    suffix = f"\n\n```diff\n{diff_text}\n```"
    if len(message) + len(suffix) <= MAX_MESSAGE_CHARS:
        return message + suffix
    budget = MAX_MESSAGE_CHARS - len(message) - len(TRUNCATION_NOTE) - 20
    if budget < 200:
        return message + f"\n\n```diff\n{diff_text[:budget]}{TRUNCATION_NOTE}\n```"
    trimmed = diff_text[:budget].rstrip() + TRUNCATION_NOTE
    return message + f"\n\n```diff\n{trimmed}\n```"


def _format_pr_message(diff_text: str) -> str:
    if not diff_text.strip():
        return (
            "Formatting differs from Biome output. "
            "CI could not build a diff preview; run pnpm exec biome check locally."
        )
    return _append_diff_block(
        "Suggested Biome formatting (unified diff):",
        diff_text,
    )


def _record_for_diagnostic(
    diagnostic: dict[str, object],
    diff_by_path: dict[str, str],
) -> dict[str, object]:
    location = diagnostic.get("location")
    if not isinstance(location, dict):
        raise ValueError("diagnostic missing location object")

    raw_path = location.get("path")
    if not isinstance(raw_path, str):
        raise ValueError("diagnostic missing location.path")

    path = _normalize_path(raw_path)
    start = location.get("start")
    if not isinstance(start, dict):
        start = {}

    message = diagnostic.get("message")
    if not isinstance(message, str):
        message = ""

    if _is_format_diagnostic(diagnostic):
        diff_text = diff_by_path.get(path, "")
        message = _format_pr_message(diff_text)

    return {
        "message": message,
        "location": {
            "path": path,
            "range": {
                "start": {
                    "line": _clamp_line(start.get("line")),
                    "column": _clamp_column(start.get("column")),
                }
            },
        },
        "severity": _severity(diagnostic.get("severity")),
    }


def _collect_format_diffs(
    repo_root: Path,
    diagnostics: list[dict[str, object]],
) -> dict[str, str]:
    paths: set[str] = set()
    for diagnostic in diagnostics:
        if not _is_format_diagnostic(diagnostic):
            continue
        location = diagnostic.get("location")
        if not isinstance(location, dict):
            continue
        raw_path = location.get("path")
        if isinstance(raw_path, str):
            paths.add(_normalize_path(raw_path))

    diff_by_path: dict[str, str] = {}
    for rel_posix in paths:
        file_path = repo_root / rel_posix
        try:
            original = file_path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            diff_by_path[rel_posix] = ""
            continue

        formatted = _format_stdout(repo_root, rel_posix)
        if formatted is None:
            diff_by_path[rel_posix] = ""
            continue

        if formatted == original:
            diff_by_path[rel_posix] = ""
            continue

        diff_by_path[rel_posix] = _unified_diff(rel_posix, original, formatted)
    return diff_by_path


def main() -> None:
    repo_root = Path.cwd()
    payload = sys.stdin.read()
    if not payload.strip():
        return

    data = json.loads(payload)
    diagnostics_raw = data.get("diagnostics")
    if not isinstance(diagnostics_raw, list):
        return

    diagnostics: list[dict[str, object]] = []
    for item in diagnostics_raw:
        if isinstance(item, dict):
            diagnostics.append(item)

    diff_by_path = _collect_format_diffs(repo_root, diagnostics)

    seen_format_paths: set[str] = set()
    for diagnostic in diagnostics:
        location = diagnostic.get("location")
        if not isinstance(location, dict):
            continue
        raw_path = location.get("path")
        if not isinstance(raw_path, str):
            continue

        path = _normalize_path(raw_path)
        if _is_format_diagnostic(diagnostic):
            if path in seen_format_paths:
                continue
            seen_format_paths.add(path)

        record = _record_for_diagnostic(diagnostic, diff_by_path)
        sys.stdout.write(json.dumps(record, ensure_ascii=False))
        sys.stdout.write("\n")


if __name__ == "__main__":
    main()
