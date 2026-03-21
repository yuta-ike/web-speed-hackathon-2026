import {
  type ChangeEventHandler,
  type FormEventHandler,
  useCallback,
  useState,
} from "react";

import { FontAwesomeIcon } from "@web-speed-hackathon-2026/client/src/components/foundation/FontAwesomeIcon";
import { ModalErrorMessage } from "@web-speed-hackathon-2026/client/src/components/modal/ModalErrorMessage";
import { ModalSubmitButton } from "@web-speed-hackathon-2026/client/src/components/modal/ModalSubmitButton";
import { AttachFileInputButton } from "@web-speed-hackathon-2026/client/src/components/new_post_modal/AttachFileInputButton";
import { convertMovie } from "@web-speed-hackathon-2026/client/src/utils/convert_movie";
import { convertSound } from "@web-speed-hackathon-2026/client/src/utils/convert_sound";

const MAX_UPLOAD_BYTES_LIMIT = 10 * 1024 * 1024;

interface SubmitParams {
  images: File[];
  movie: File | undefined;
  sound: File | undefined;
  text: string;
}

interface Props {
  id: string;
  hasError: boolean;
  isLoading: boolean;
  onResetError: () => void;
  onSubmit: (params: SubmitParams) => void;
}

export const NewPostModalPage = ({
  id,
  hasError,
  isLoading,
  onResetError,
  onSubmit,
}: Props) => {
  const [params, setParams] = useState<SubmitParams>({
    images: [],
    movie: undefined,
    sound: undefined,
    text: "",
  });

  const [hasFileError, setHasFileError] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleChangeText = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (ev) => {
      const value = ev.currentTarget.value;
      setParams((params) => ({
        ...params,
        text: value,
      }));
    },
    [],
  );

  const handleChangeImages = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (ev) => {
      const files = Array.from(ev.currentTarget.files ?? []).slice(0, 4);
      const isValid = files.every(
        (file) => file.size <= MAX_UPLOAD_BYTES_LIMIT,
      );

      setHasFileError(isValid !== true);
      if (isValid) {
        setParams((params) => ({
          ...params,
          images: files,
          movie: undefined,
          sound: undefined,
        }));
      }
    },
    [],
  );

  const handleChangeSound = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => {
      const file = Array.from(ev.currentTarget.files ?? [])[0]!;
      const isValid = file.size <= MAX_UPLOAD_BYTES_LIMIT;

      setHasFileError(isValid !== true);
      if (isValid) {
        setIsConverting(true);

        convertSound(file, { extension: "mp3" }).then((converted) => {
          setParams((params) => ({
            ...params,
            images: [],
            movie: undefined,
            sound: new File([converted], "converted.mp3", {
              type: "audio/mpeg",
            }),
          }));

          setIsConverting(false);
        });
      }
    },
    [],
  );

  const handleChangeMovie = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => {
      const file = Array.from(ev.currentTarget.files ?? [])[0]!;
      const isValid = file.size <= MAX_UPLOAD_BYTES_LIMIT;

      setHasFileError(isValid !== true);
      if (isValid) {
        setIsConverting(true);

        convertMovie(file, { extension: "mp4", size: 640 })
          .then((converted) => {
            setParams((params) => ({
              ...params,
              images: [],
              movie: new File([converted], "converted.mp4", {
                type: "video/mp4",
              }),
              sound: undefined,
            }));

            setIsConverting(false);
          })
          .catch(console.error);
      }
    },
    [],
  );

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (ev) => {
      ev.preventDefault();
      onResetError();
      onSubmit(params);
    },
    [params, onSubmit, onResetError],
  );

  return (
    <form className="grid gap-y-6" onSubmit={handleSubmit}>
      <h2 id={id} className="text-center text-2xl font-bold">
        新規投稿
      </h2>

      <textarea
        className="border-cax-border placeholder-cax-text-subtle focus:outline-cax-brand w-full resize-none rounded-xl border px-3 py-2 focus:outline-2 focus:outline-offset-2"
        rows={4}
        onChange={handleChangeText}
        placeholder="いまなにしてる？"
      />

      <div className="text-cax-text flex w-full items-center justify-evenly">
        <AttachFileInputButton
          accept="image/*"
          active={params.images.length !== 0}
          icon={
            <svg
              width="12"
              height="12"
              viewBox="0 0 576 512"
              fill="currentColor"
              className="inline"
            >
              <path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path>
            </svg>
          }
          label="画像を添付"
          onChange={handleChangeImages}
        />
        <AttachFileInputButton
          accept="audio/*"
          active={params.sound !== undefined}
          icon={
            <svg
              width="12"
              height="12"
              viewBox="0 0 512 512"
              fill="currentColor"
              className="inline"
            >
              <path d="M470.38 1.51L150.41 96A32 32 0 0 0 128 126.51v261.41A139 139 0 0 0 96 384c-53 0-96 28.66-96 64s43 64 96 64 96-28.66 96-64V214.32l256-75v184.61a138.4 138.4 0 0 0-32-3.93c-53 0-96 28.66-96 64s43 64 96 64 96-28.65 96-64V32a32 32 0 0 0-41.62-30.49z"></path>
            </svg>
          }
          label="音声を添付"
          onChange={handleChangeSound}
        />
        <AttachFileInputButton
          accept="video/*"
          active={params.movie !== undefined}
          icon={
            <svg
              width="12"
              height="12"
              viewBox="0 0 576 512"
              fill="currentColor"
              className="inline"
            >
              <path d="M336.2 64H47.8C21.4 64 0 85.4 0 111.8v288.4C0 426.6 21.4 448 47.8 448h288.4c26.4 0 47.8-21.4 47.8-47.8V111.8c0-26.4-21.4-47.8-47.8-47.8zm189.4 37.7L416 177.3v157.4l109.6 75.5c21.2 14.6 50.4-.3 50.4-25.8V127.5c0-25.4-29.1-40.4-50.4-25.8z"></path>
            </svg>
          }
          label="動画を添付"
          onChange={handleChangeMovie}
        />
      </div>

      <ModalSubmitButton
        disabled={isConverting || isLoading || params.text === ""}
        loading={isConverting || isLoading}
      >
        {isConverting || isLoading ? "変換中" : "投稿する"}
      </ModalSubmitButton>

      <ModalErrorMessage>
        {hasFileError
          ? "10 MB より小さくしてください"
          : hasError
            ? "投稿ができませんでした"
            : null}
      </ModalErrorMessage>
    </form>
  );
};
