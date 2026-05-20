import type { ReactElement } from "react";

interface VideoEmbedProps {
  videoId: string;
  title: string;
}

export function VideoEmbed({ videoId, title }: VideoEmbedProps): ReactElement {
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{ paddingBottom: "56.25%" }}
    >
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
