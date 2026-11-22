import nodemailer from "nodemailer";

export function adapters(env = process.env) {
  const smtp = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    secure: env.SMTP_PORT === "465",
    ...(env.SMTP_USER
      ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } }
      : {}),
  });

  return {
    email: {
      send: (to, code, purpose = "verification") => {
        const isReset = purpose === "password-reset";

        return smtp.sendMail({
          from: env.MAIL_FROM,
          to,
          subject: isReset
            ? "Task Management - Password Reset OTP"
            : "Task Management - Email Verification",
          text: isReset
            ? `Your password reset code is ${code}. It expires in ten minutes.`
            : `Your verification code is ${code}. It expires in ten minutes.`,
        });
      },
    },
  };
}