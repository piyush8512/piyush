"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { BsFillSendFill } from "react-icons/bs";
import { PrimaryText, SecondaryText, TertiaryText } from "@/components/text";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Textarea from "@/components/TsxtArea";
import AnimatedSignature from "@/components/AnimatedSignature";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactForm = () => {
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!data.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!data.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(
          result.error || "Failed to send email. Please try again."
        );
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-5 p-2 w-full h-full min-h-full max-h-[560px] overflow-hidden md:mt-0">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full flex flex-col items-center justify-center gap-4"
          >
            <div className="text-green-500 text-4xl">✓</div>
            <h3 className="text-xl font-bold text-green-500">Message Sent!</h3>
            <p className="text-tertiary text-center">
              Thank you for reaching out. I'll get back to you soon!
            </p>
          </motion.div>
        ) : submitError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full flex flex-col items-center justify-center gap-4"
          >
            <div className="text-red-500 text-4xl">✕</div>
            <h3 className="text-xl font-bold text-red-500">Error</h3>
            <p className="text-tertiary text-center">{submitError}</p>
            <button
              onClick={() => {
                setSubmitError("");
              }}
              className="mt-4 py-2 px-4 border border-purple text-tertiary hover:bg-purple/20 transition"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
            {/* Form column */}
            <form
              onSubmit={handleSubmit}
              className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-[1fr] md:mt-0"
            >
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Name"
                    label="Name"
                    value={data.name}
                    error={errors.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    label="Email"
                    value={data.email}
                    error={errors.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  label="Subject"
                  value={data.subject}
                  error={errors.subject}
                  onChange={handleChange}
                  required
                />

                <Textarea
                  name="message"
                  placeholder="Message"
                  label="Message"
                  value={data.message}
                  error={errors.message}
                  onChange={handleChange}
                  required
                />

                <div className="flex items-center gap-3">
                  <Button disabled={loading}>
                    {loading ? "Sending..." : "Send"} <BsFillSendFill />
                  </Button>

                  <button
                    type="button"
                    onClick={() => setPreviewOpen((s) => !s)}
                    className="py-2 px-3 border border-purple text-tertiary hover:bg-purple/20 transition"
                  >
                    {previewOpen ? "Close Preview" : "Preview"}
                  </button>
                </div>
              </div>
            </form>

            {/* Preview column */}
            <div className="p-3 border border-transparent md:border-l md:border-purple/10 rounded">
              {previewOpen ? (
                <div className="w-full h-full flex flex-col gap-3 text-sm overflow-y-auto">
                  <div className="w-fit ml-auto">
                    <PrimaryText>{data.name || ""}</PrimaryText>
                    <PrimaryText>{data.email || ""}</PrimaryText>
                    <PrimaryText>{new Date().toLocaleDateString()}</PrimaryText>
                  </div>

                  <div>
                    <TertiaryText className="mx-auto underline font-bold w-fit">
                      {data.subject
                        ? data.subject.toUpperCase()
                        : "No Subject..."}
                    </TertiaryText>
                  </div>

                  <div className="my-3">
                    <PrimaryText>{data.message || "No Message..."}</PrimaryText>
                  </div>

                  <div className="w-fit mr-auto">
                    <div className="max-h-[40px] max-w-[40%]">
                      <AnimatedSignature />
                    </div>
                    <hr />
                    <PrimaryText>{data.name || ""}</PrimaryText>
                    <PrimaryText>{data.email || ""}</PrimaryText>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-tertiary">
                  Preview will appear here
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactForm;
