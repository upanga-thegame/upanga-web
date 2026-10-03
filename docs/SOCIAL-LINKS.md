# Upanga social destination checks

Checked October 3, 2026 before publishing the Follow Upanga banner.
These checks establish matching public game identity and destination, rather than
proving who controls an account. All eight configured URLs matched Upanga.

| Platform | Identity evidence |
| --- | --- |
| X | Public metadata: Upanga The Game (@upangadev), tactical RPG / African folklore bio. The existing official website also linked this account. |
| Bluesky | Public profile API: Upanga The Game, matching game description, upanga-game.com backlink. |
| Mastodon | Public account API: Upanga The Game, matching game description, upanga-game.com website field. |
| Threads | Public metadata: Upanga The Game (@upangadev), matching game description. |
| Instagram | Public metadata: Upanga The Game (@upangadev), matching game description and website. |
| Facebook | The exact configured ID opens Upanga: The Soul Blade, with the game's description, website link and Video Game category. Browser inspection explicitly identifies it as a Page (Manage Page / Page profile content). |
| TikTok | Public profile data: upanga.the.game / Upanga The Game, African folklore RPG description, website domain. |
| YouTube | Public metadata: Upanga The Game, official Upanga: The Soul Blade channel description, website backlink. Channel ID UCM9TlcIMtTYo198MD4kDMRQ. |

Destination URLs are in `data/social-links.json`. Additional primary API sources:

- https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=upangadev.bsky.social
- https://mastodon.social/api/v1/accounts/lookup?acct=upangadev

No unresolved destination identity checks. Mastodon's reciprocal website badge
was absent; the matching profile and website field were present. Facebook uses
the game Page ID 61595151567254, as requested. Pinterest is excluded.
