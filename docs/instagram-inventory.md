# Instagram collection inventory

Source: **@justbeyou_hair**. Destination: **@hairnthere**.

Collected without an API key from the public profile and individual post pages. Harry confirmed this is Elisabeth’s professional work and authorized reuse on the website. No content was posted to Instagram.

## Coverage and limits

- 12 original posts, with their captions and grouping preserved in `src/data/instagram-posts.json`.
- 21 downloaded images: 11 photos across two carousels, nine reel covers, and one expired appointment promotion.
- Website: 11 selected posts, represented by one cover each. All 20 selected photo/cover assets are stored locally under `public/images/portfolio/` for later use.
- The appointment promotion is retained in the inventory but excluded from the website. Its image is only in the local collection.
- Reel covers are still images, not recovered video files. Website links open the original reels for playback.
- This is a partial account inventory. The logged-out profile exposes 12 posts; older-post access presents a sign-in prompt. No claim of full account coverage.
- Local raw downloads and source responses: `.lavish/instagram-inventory/` (ignored by Git). Public inventory omits expiring CDN URLs.
- No before/after claims are inferred from carousel grouping.

## Collected posts

| Original post                                                                       | Date       | Type     | Assets | Website                |
| ----------------------------------------------------------------------------------- | ---------- | -------- | ------ | ---------------------- |
| [Balayage & money pieces](https://www.instagram.com/justbeyou_hair/p/Ccb6RAnOH0Q/)  | 2022-04-17 | carousel | 7      | Yes                    |
| [Grey blending](https://www.instagram.com/justbeyou_hair/reel/CdkUbpDgEe5/)         | 2022-05-15 | reel     | 1      | Yes                    |
| [Brunette dimension](https://www.instagram.com/justbeyou_hair/reel/CdkTadlAFRn/)    | 2022-05-15 | reel     | 1      | Yes                    |
| [Bright blonde](https://www.instagram.com/justbeyou_hair/reel/CdkS1ZrAlTa/)         | 2022-05-15 | reel     | 1      | Yes                    |
| [Hair day together](https://www.instagram.com/justbeyou_hair/reel/Ccb5TfYjRBb/)     | 2022-04-17 | reel     | 1      | Yes                    |
| [Sun-kissed highlights](https://www.instagram.com/justbeyou_hair/reel/CbRhxO7g085/) | 2022-03-19 | reel     | 1      | Yes                    |
| [Blonde waves](https://www.instagram.com/justbeyou_hair/reel/CbPES0HAGdt/)          | 2022-03-18 | reel     | 1      | Yes                    |
| [A little color](https://www.instagram.com/justbeyou_hair/reel/CbLCNyND7V3/)        | 2022-03-16 | reel     | 1      | Yes                    |
| [Pretty in pink](https://www.instagram.com/justbeyou_hair/reel/CavlJeLAVoX/)        | 2022-03-06 | reel     | 1      | Yes                    |
| [Golden waves](https://www.instagram.com/justbeyou_hair/reel/CaJD4enA-4a/)          | 2022-02-19 | reel     | 1      | Yes                    |
| [Blue dimension](https://www.instagram.com/justbeyou_hair/p/CaG1Vu0geif/)           | 2022-02-18 | carousel | 4      | Yes                    |
| [Archived promotion](https://www.instagram.com/justbeyou_hair/p/CZhtcWvOech/)       | 2022-02-03 | photo    | 1      | No — expired promotion |

## Repost and gallery workflow

1. Continue discovery through an authorized signed-in browsing session if one is available; source-account login is not required to view its public posts. Deduplicate by source post ID.
2. Recover video files where publicly available and verify playback before marking a reel complete.
3. Review each original caption and prepare a separate revised caption for @hairnthere. Preserve the original verbatim. Check old handles, prices, service locations, and booking claims.
4. Use the `repostStatus` field to track review and eventual publication; record new destination URLs when posts are published. No scheduler or automatic publishing is active.
5. Publish gradually at a cadence Elisabeth chooses. Website selection is independent of repost timing. Update source links only after a matching new post exists.

## Landing-page behavior

The gallery keeps Mountain Cinema’s typography and theme tokens. Visitors swipe, use keyboard/native scrolling, or press previous/next to browse the 11 posts. No autoplay or motion is required. Photos use contain sizing to preserve the original composition. Full captions expand below the covers; carousel entries link to their original grouped posts. All content and links render on the server; shadcn’s carousel (Embla) adds swipe and arrow navigation, with native horizontal scrolling before JavaScript loads. Transitions are instant and there is no autoplay. Original captions are historical portfolio context, not current service policy.

## Original captions

### Balayage & money pieces — Ccb6RAnOH0Q

More pictures! Good examples of a balayage with and without the money piece!

### Grey blending — CdkUbpDgEe5

Growing out grey can be tolerable with highlights!

### Brunette dimension — CdkTadlAFRn

❤️‍🔥

### Bright blonde — CdkS1ZrAlTa

Another day another slay, period 💁‍♀️

### Hair day together — Ccb5TfYjRBb

Two best friends getting their hair done at the same time! So much fun 🤩 literally the prettiest hair 😍 @shay.payton @abi_gabrielaa

### Sun-kissed highlights — CbRhxO7g085

Check it out 💁‍♀️ little sun kissed highlights ☀️

### Blonde waves — CbPES0HAGdt

Abra cadabra 🪄

### A little color — CbLCNyND7V3

Add a little color to brighten your day 🤩

### Pretty in pink — CavlJeLAVoX

Pretty in pink 💅

### Golden waves — CaJD4enA-4a

Hey now you’re a rock star 🌟
Get the show on
Get paid 💁‍♀️

### Blue dimension — CaG1Vu0geif

🦕✨🖤💙

### Archived promotion — CZhtcWvOech

I’ve got openings today, tomorrow and Saturday! Let me know if you need your color or cuts done! Xoxo 😘 💋
