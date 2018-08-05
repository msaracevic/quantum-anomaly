import c from 'ansi-colors';
import util from 'util';
import config from '../config';

function addTime(message) {
  let time = new Date().toLocaleString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
  return `[${time}] ${message}`;
}

function outputMessage(message, color) {
  if (!config.logger.silent) {
    console.log(c[color](message));
  }
}

export function appLog(message, color) {
  color = color || 'blue';
  outputMessage(addTime(message), color);
}

export function appWarning(message, color) {
  color = color || 'yellow';
  outputMessage(addTime(`Warning: ${message}`), color);
}

export function action(message, color) {
  color = color || 'magenta';
  outputMessage(addTime(`${message}`), color);
}

export function error(message, color) {
  color = color || 'red';
  outputMessage(addTime(`Error: ${message}`), color);
}

export function header(message, color) {
  color = color || 'blue';
  outputMessage(`${message}`, color);
}

export function tabbed(message, color) {
  color = color || 'blue';
  outputMessage(`\t${message}`, color);
}

export function newLine() {
  console.log('');
}

export function inspect(message) {
  console.log(util.inspect(message, false, 2));
}
