
const express = require('express');
const { addonBuilder } = require('stremio-addon-sdk');

const manifest = {
    id: 'org.stremio.dropbox',
    version: '1.0.0',
    name: 'Películas Dropbox',
    description: 'Addon privado para ver tus películas en Dropbox',
    types: ['movie'],
    catalogs: [{
        type: 'movie',
        id: 'dropbox',
        name: 'Películas Dropbox'
    }],
    resources: ['catalog', 'stream'],
    idPrefixes: ['dropbox:'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg',
    background: 'https://c4.wallpaperflare.com/wallpaper/216/180/80/movie-theater-wallpaper-preview.jpg'
};

const builder = new addonBuilder(manifest);

const movies = [{
    id: 'dropbox:untildawn2025',
    name: 'Until Dawn (2025)',
    poster: 'https://m.media-amazon.com/images/I/71x6UArEeaL._AC_SL1111_.jpg'
}];

builder.defineCatalogHandler(() => {
    return Promise.resolve({ metas: movies });
});

builder.defineStreamHandler(({ id }) => {
    if (id === 'dropbox:untildawn2025') {
        return Promise.resolve({
            streams: [{
                title: 'Dropbox 4K',
                url: 'https://www.dropbox.com/scl/fi/ahrwv0ub8ai63w1ai7618/Until-Dawn-2025-4k-2160p-Esp.mkv?rlkey=6afksg1ppcr0h0ddnxadsrnnx&st=74px98ab&raw=1'
            }]
        });
    }
    return Promise.resolve({ streams: [] });
});

// ✅ Aquí tu addon escucha peticiones desde Stremio
const app = express();
const port = process.env.PORT || 7000;

app.get('/manifest.json', (req, res) => {
    res.send(builder.getInterface().manifest);
});

app.get('/:resource/:type/:id/:extra?.json', (req, res) => {
    builder.getInterface().get(req, res);
});

app.listen(port, () => {
    console.log(`Addon funcionando en http://localhost:${port}`);
});
