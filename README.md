# Upanga: The Soul-Blade - Splash Webpage

Repository for the official splash and landing page for the mobile game **Upanga: The Soul-Blade**.

## Project Structure

The core files for the website are:

- `index.html`: The main HTML file containing the structure of the webpage.
- `styles.css`: The stylesheet that defines the appearance and layout, including all colors, fonts, and responsive design.
- `script.js`: The JavaScript file that handles interactive elements.
- `privacy.html`: The privacy policy for the game and website.

## Legal Pages
The site includes:
- `privacy.html`
- `terms.html`
- `data-deletion.html`

## FAQ Automation
- FAQ content is stored in `docs/FAQ.MD`.
- Categories use `##` headings.
- Questions use `###` headings.
- Answers are normal markdown text under each question.
- GitHub Actions generates `data/faq.json` during deployment.
- The homepage loads `data/faq.json` and renders collapsible FAQ sections.
