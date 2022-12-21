const capitalize = (text) => text.split(' ').map((v) => `${v.charAt(0).toUpperCase()}${v.slice(1)}`).join(' ');

export default capitalize;
