import nodemailer from 'nodemailer';
import * as logger from '../../helpers/logger';

let transporter;

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    secure:  true,
    auth:    {
      user: process.env.EMAIL_CLIENT_ID,
      pass: process.env.EMAIL_CLIENT_PASS
    }
  });
}

function wrongDataProvided(error) {
  logger.error(`Email sender: ${error}`);
  return true;
}

/* Mail example 
  mail = {
    to: 'mail@mail.com, mail2@mail.com',
    subject: 'Subject',
    html: '<div>Message</div>'
  };
*/

export default function (mail = {}, successMessage) {
  let error = false;
  if (!transporter) transporter = createTransporter();
  
  mail.from = '"Quantum Anomaly web app" <quantum.anomaly.app@gmail.com>';
  
  if (!mail.to) error = wrongDataProvided('Missing from field');
  if (!mail.subject) error = wrongDataProvided('Missing subject field');
  if (!mail.html) error = wrongDataProvided('Missing html field');
  if (error) return;
  
  transporter.sendMail(mail, (error, info) => {
    if (error) return console.log(error);
    logger.action(successMessage, 'magenta');
  });
}
