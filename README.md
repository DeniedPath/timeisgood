# Cool Countdown Timer

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## What It Does

The Cool Countdown Timer is a versatile timer application that allows users to set countdowns, switch between different modes (such as Pomodoro), and manage multiple timers. It includes features like:

- **Timer Display**: Shows the remaining time in a visually appealing format.
- **Pomodoro Mode**: Helps users manage work and break intervals.
- **Dark Mode**: Switch between light and dark themes.
- **Fullscreen Mode**: Expand the timer to fullscreen for better focus.
- **Alarm Sound Selection**: Choose different alarm sounds for the timer.
- **Timer History**: View the history of previous timers in a collapsible dropdown.
- **Music Playlist**: Play relaxing music while using the timer.
- **Settings Popup**: Adjust settings like background color, timer speed, and music volume.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.js`. The page auto-updates as you edit the file.

## Project Structure

```
public/
  alarm.mp3
  file.svg
  globe.svg
  next.svg
  vercel.svg
  window.svg
src/
  app/
    favicon.ico
    globals.css
    layout.js
    page.js
  components/
    Header.js
    MusicPlaylist.js
    SettingsPopup.js
    Timer.jsx
  styles/
    Header.module.css
    MusicPlaylist.module.css
    SettingsPopup.module.css
    Timer.module.css
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
