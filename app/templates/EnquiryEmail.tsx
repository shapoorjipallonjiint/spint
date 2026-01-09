import * as React from "react";

type EnquiryEmailProps = {
  name: string;
  email: string;
  organization: string;
  country: string;
  subject: string;
  message: string;
};

export const EnquiryEmail: React.FC<EnquiryEmailProps> = ({
  name,
  email,
  organization,
  country,
  subject,
  message,
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f7fb",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ color: "#1E45A2", marginBottom: "10px" }}>
          New Contact Enquiry
        </h2>

        <p style={{ fontSize: "14px", color: "#555" }}>
          You have received a new enquiry from your website.
        </p>

        <hr style={{ margin: "20px 0" }} />

        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Organization:</strong> {organization}</p>
        <p><strong>Country:</strong> {country}</p>
        <p><strong>Subject:</strong> {subject}</p>

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#f1f4ff",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </div>

        <p
          style={{
            marginTop: "24px",
            fontSize: "12px",
            color: "#999",
          }}
        >
          This email was sent from your Contact Us form.
        </p>
      </div>
    </div>
  );
};
