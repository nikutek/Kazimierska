"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (res.ok) {
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-sm px-4 py-3 text-base focus:outline-none focus:border-black transition-colors duration-200 bg-white placeholder-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm tracking-wider uppercase text-gray-500 mb-2">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm tracking-wider uppercase text-gray-500 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm tracking-wider uppercase text-gray-500 mb-2">
          Message
        </label>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto px-10 py-3 bg-black text-white text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-700 pt-1">
          Message sent. We will get back to you within 2–3 business days.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 pt-1">
          Something went wrong. Please try again or reach us directly at pg.pasja@wp.pl
        </p>
      )}
    </form>
  );
}
