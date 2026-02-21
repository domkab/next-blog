"use client";

import { Button, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import Image from "next/image";
import styles from "./EmailSubscribeWModal.module.scss";
import confetti from "canvas-confetti";
import axios from "axios";
import type { AxiosError } from "axios";
import clsx from "clsx";

export function EmailSubscribeWModal() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      await axios.post("/api/newsletter", { email });

      setStatus("success");
      setEmail("");

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setOpenModal(false);
        setStatus("idle");
      }, 2000);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;

      setStatus("error");
      setErrorMessage(
        error?.response?.data?.error || "Network error, please try again",
      );
    }
  };

  return (
    <>
      <div
        className={clsx(
          "p-2 bg-amber-100 dark:bg-slate-700 mb-7 rounded-tl-3xl rounded-br-3xl shadow-sm",
          styles.subscribe,
        )}
      >
        <div className="flex flex-col sm:flex-row p-3 border-2 border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
          <div className="flex-1 justify-center flex flex-col">
            <h2 className="text-2xl">
              Stay ahead with the latest gadget insights.
            </h2>
            <p className="text-gray-500 my-2">
              Join our newsletter and get updates right to your inbox — no spam,
              just tech that matters.
            </p>
            <Button
              gradientDuoTone="purpleToPink"
              className="w-full rounded-tl-xl rounded-bl-none"
              onClick={() => setOpenModal(true)}
            >
              Subscribe Now
            </Button>
          </div>

          <div className="flex-1 mt-6 sm:mt-0 sm:ml-6 flex justify-center">
            <Image
              className={clsx(styles["subscribe__image"])}
              src="/images/cat-holding-letter-signup-wink-2.webp"
              alt="Cat holding email"
              // width={500}
              // height={600}
              width={300}
              height={300}
              unoptimized
            />
          </div>
        </div>
      </div>

      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        popup
        className="subscribe-modal"
      >
        <Modal.Header className="justify-center subscribe-modal__header" />
        <Modal.Body>
          <div className="flex flex-col items-center text-center space-y-4 px-2 py-4">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Join Our Gadget Newsletter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">
              Stay updated with the latest in tech, gadgets, and reviews. No
              spam, just value.
            </p>

            <div className="w-full max-w-sm">
              <TextInput
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                color={errorMessage ? "failure" : undefined}
                helperText={
                  errorMessage ? (
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  ) : undefined
                }
                required
                shadow
                theme={{
                  field: {
                    input: {
                      base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
                      colors: {
                        failure:
                          "bg-red-50 border-red-500 text-red-900 placeholder-red-700 dark:bg-gray-900 dark:text-red-100 dark:placeholder-gray-300",
                      },
                    },
                  },
                }}
              />
            </div>

            <Button
              onClick={handleSubmit}
              isProcessing={status === "loading"}
              disabled={status === "success"}
              className="w-full max-w-sm"
            >
              {status === "success" ? "Subscribed!" : "Subscribe"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
