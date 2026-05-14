import type { ReactElement } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { VideoEmbed } from "./VideoEmbed";

interface VideoItem {
  id: string;
  title: string;
  description: string;
}

interface VideoGridProps {
  videos: VideoItem[];
}

export function VideoGrid({ videos }: VideoGridProps): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {videos.map((video) => (
        <Card key={video.id}>
          <CardContent className="p-0">
            <VideoEmbed videoId={video.id} title={video.title} />
          </CardContent>
          <CardHeader>
            <CardTitle>{video.title}</CardTitle>
            <CardDescription>{video.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
