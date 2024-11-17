import { EmailTemplate } from "@/types";

export const emailTemplates: Record<string, EmailTemplate> = {
	"sunday-zoom": {
		subject: "Booking Confirmation",
		text: `Your payment was successful. Thank you for booking with us, {firstName}!`,
		html: `
        <style>
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            text-align: center;
          }
          .editor-image {
            max-width: 100%;
            display: inline-block;
            margin: 1em 0;
          }
        </style>
        <div class="container">
          <img alt="Logo" src="https://sarahkyoga.com/sky_banner.webp" style="max-width: 100%; height: auto; display: block; margin: auto;">
          <div><br><br></div>
          <h3>Your payment was successful. Thank you for booking with me, {firstName}!</h3>
          <br />
          <p>Your order ID is <strong>{orderId}</strong>.</p>
          <br />
          <p>I can't wait to see you this Sunday! Join me at 8:30am this Sunday<br><br>
            <a href="https://us02web.zoom.us/j/82487687316?pwd=Mi8wbCt4cEdFdis2cWVhWUZCSmpOdz09">https://us02web.zoom.us/j/82487687316?pwd=Mi8wbCt4cEdFdis2cWVhWUZCSmpOdz09</a><br>
          </p>
          <p>Meeting ID: 824 8768 7316</p><br>
          <p>Passcode: 067531</p>
        </div>
      `,
	},
	"1": {
		subject: "Booking Confirmation",
		text: `Your payment was successful. Thank you for booking with us, {firstName}!`,
		html: `
        <style>
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            text-align: center;
          }
          .editor-image {
            max-width: 100%;
            display: inline-block;
            margin: 1em 0;
          }
        </style>
        <div class="container">
          <img alt="Logo" src="https://sarahkyoga.com/sky_banner.webp" style="max-width: 100%; height: auto; display: block; margin: auto;">
          <div><br><br></div>
          <h3>Your payment was successful. Thank you for booking with me, {firstName}!</h3>
          <br />
          <p>Your order ID is <strong>{orderId}</strong>.</p>
          <br />
          <p>I will reach out personally with specific details if required!</p>
        </div>
      `,
	},
	"default-template": {
		subject: "Booking Confirmation",
		text: `Your payment was successful. Thank you for booking with us, {firstName}!`,
		html: `
        <style>
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            text-align: center;
          }
          .editor-image {
            max-width: 100%;
            display: inline-block;
            margin: 1em 0;
          }
        </style>
        <div class="container">
          <img alt="Logo" src="https://sarahkyoga.com/sky_banner.webp" style="max-width: 100%; height: auto; display: block; margin: auto;">
          <div><br><br></div>
          <h3>Your payment was successful. Thank you for booking with me, {firstName}!</h3>
          <br />
          <p>Your order ID is <strong>{orderId}</strong>.</p>
          <br />
          <p>I will reach out personally with specific details if required!</p>
        </div>
      `,
	},
};
