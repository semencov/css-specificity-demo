#!/bin/env node

const { resolve } = require('path');
const { promises: fs } = require('fs');
const chokidar = require('chokidar');
const postcss = require('postcss');
const clear = require('clear');
const { highlight, fromJson } = require('cli-highlight');

const calcSpecificity = async path => {
    if (path) {
        clear();
        const css = await fs.readFile(resolve(__dirname, path), 'utf8');

        postcss([require('./plugin.js')])
            .process(css, { from: path })
            .then(result => {
                const output = highlight(result.css, {
                    language: 'css',
                    ignoreIllegals: true,
                    theme: fromJson({
                        keyword: 'blue',
                        built_in: ['cyan', 'dim'],
                        selector: 'yellowBright',
                        comment: 'gray'
                    })
                });

                process.stdout.write(output);
            });
    }
};

const watcher = chokidar
    .watch('./styles/*.css', {
        persistent: true,
        usePolling: true
    })
    .on('change', calcSpecificity)
    .on('add', calcSpecificity);

process.on('SIGINT', () => {
    watcher.close().then(() => console.log('\nClosed.'));
});
