import Image from "next/image";
import type { GithubProfileData } from "@/ai/tools/github_profile";

export function GithubProfile({ data }: { data: GithubProfileData }) {
  return (
    <a
      href={data.html_url}
      target="_blank"
      rel="noreferrer"
      className="bg-zinc-950 rounded-lg flex gap-3 p-6 hover:bg-zinc-900"
    >
      <Image
        src={data.avatar_url}
        alt={data.name ?? data.login}
        width={40}
        height={40}
        className="size-10 rounded-full"
      />

      <div className="flex flex-col gap-1">
        <span className="text-lg font-medium">{data.name ?? data.login}</span>
        {data.bio && (
          <p className="text-sm text-zinc-400 leading-relaxed">{data.bio}</p>
        )}
      </div>
    </a>
  )
}