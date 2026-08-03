import { initializePaddle } from "@paddle/paddle-js";

let paddle: Awaited<ReturnType<typeof initializePaddle>> = undefined;

export async function getPaddle() {
  if (!paddle) {
    paddle = await initializePaddle({
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
      environment: "sandbox",
      eventCallback: (event) => {
        if (event.name === "checkout.completed") {
          window.location.href = `${window.location.origin}/app/welcome`;
        }
      },
    });
  }
  return paddle;
}
