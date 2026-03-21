import { FastAverageColor } from "fast-average-color";
import { type ReactEventHandler, useCallback, useState } from "react";

import { getProfileImagePath } from "@web-speed-hackathon-2026/client/src/utils/get_path";
import { formatDate } from "../../utils/format-date";

interface Props {
  user: Models.User;
}

export const UserProfileHeader = ({ user }: Props) => {
  const [averageColor, setAverageColor] = useState<string | null>(null);

  // 画像の平均色を取得します
  const handleLoadImage = useCallback<ReactEventHandler<HTMLImageElement>>(
    (ev) => {
      const fac = new FastAverageColor();
      const { rgb } = fac.getColor(ev.currentTarget, { mode: "precision" });
      setAverageColor(rgb);
      fac.destroy();
    },
    [],
  );

  return (
    <header className="relative">
      <div
        className="h-32 bg-cax-surface-subtle"
        style={{
          backgroundColor: averageColor ?? undefined,
        }}
      ></div>
      <div className="border-cax-border bg-cax-surface-subtle absolute left-2/4 m-0 h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border sm:h-32 sm:w-32">
        <img
          alt=""
          decoding="async"
          crossOrigin="anonymous"
          onLoad={handleLoadImage}
          src={getProfileImagePath(user.profileImage.id)}
        />
      </div>
      <div className="px-4 pt-20">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-cax-text-muted">@{user.username}</p>
        <p className="pt-2">{user.description}</p>
        <p className="text-cax-text-muted pt-2 text-sm">
          <span className="pr-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 448 512"
              fill="currentColor"
              className="inline"
            >
              <path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path>
            </svg>
          </span>
          <span>
            <time dateTime={new Date(user.createdAt).toISOString()}>
              {formatDate(user.createdAt, "yyyy年M月d日")}
            </time>
            からサービスを利用しています
          </span>
        </p>
      </div>
    </header>
  );
};
