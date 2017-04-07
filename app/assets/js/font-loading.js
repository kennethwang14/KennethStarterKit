function createCookie(name, value, days) {
    let expires;
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toGMTString()}`;
    } else {
        expires = '';
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
}

const fonts = [
    new FontFaceObserver('Roboto').load(),
];

Promise.all(fonts).then(() => {
    document.documentElement.className += ' fonts-loaded';
    createCookie('fonts-loaded', true, 365);
});
