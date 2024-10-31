"use client";

import RequestWorkForm from "../components/forms/RequestWorkForm";

export default function WorkRequestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Work Request</h1>
      <RequestWorkForm />
    </div>
  );
}
