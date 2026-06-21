"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "success" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setStatus("error");
      return;
    }
    // mock submit — wire to a real handler later
    setStatus("success");
    setEmail("");
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex gap-2" noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Enter your email"
          aria-label="Email address"
          className="h-12 w-full rounded-btn border border-line-dark bg-elevated px-4 text-sm text-sand placeholder:text-mist focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="sheen-btn grid h-12 w-12 shrink-0 place-items-center rounded-btn bg-accent text-white transition-colors hover:bg-accent-hover"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
      <p
        className={cn(
          "mt-2 text-sm",
          status === "success" && "text-accent",
          status === "error" && "text-accent",
          status === "idle" && "invisible",
        )}
        role="status"
      >
        {status === "success" && "Thanks for joining our newsletter."}
        {status === "error" && "Oops! Something went wrong."}
        {status === "idle" && "placeholder"}
      </p>
    </div>
  );
}
