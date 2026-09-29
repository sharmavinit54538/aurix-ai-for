const fs = require('fs');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');

const html = '<div class="w-[calc(100%-2rem)] w-[calc(100vw-2rem)] w-[calc(100%_-_2rem)] w-[calc(100vw_-_2rem)] max-w-[400px]"></div>';

postcss([tailwindcss({ content: [{ raw: html }] })])
  .process('@tailwind utilities;', { from: undefined })
  .then(r => {
    console.log(r.css);
    fs.unlinkSync('temp_check.js');
  })
  .catch(err => console.error(err));