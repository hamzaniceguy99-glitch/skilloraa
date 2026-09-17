# Skilloraa — site de coaching artistique

Site vitrine statique (HTML / CSS / JS, sans framework ni build) pour une
activité de coaching artistique : dessin, peinture, illustration numérique et
photographie. Hébergé sur GitHub Pages, domaine `skilloraa.shop`.

---

## ⚠️ À faire AVANT de communiquer sur le site

Le site contient du **contenu d'exemple**. Il est publiable tel quel pour tester
la mise en page, mais plusieurs éléments doivent être remplacés avant de
l'utiliser pour de vrai.

| Priorité | Quoi | Où |
|---|---|---|
| 🔴 **Bloquant** | Les 3 témoignages sont inventés. Remplacez-les par de vrais avis (avec l'accord des personnes) **ou supprimez la section**. Publier de faux avis clients est une pratique commerciale trompeuse. | `index.html`, section `#temoignages` |
| 🔴 **Bloquant** | Chiffres de la page d'accueil : « 240+ élèves », « 4,9/5 ». Mettez vos vrais chiffres ou retirez le bloc. | `index.html`, `.hero__proof` |
| 🔴 **Bloquant** | Mentions légales : identité de l'éditeur, SIREN, adresse. Obligatoire en France (art. 6-III LCEN). | `mentions-legales.html` |
| 🟠 Important | « Sofia Renard » est un nom d'exemple. Mettez le vôtre. | `index.html`, `a-propos.html` |
| 🟠 Important | Le formulaire de contact n'est pas encore branché (voir ci-dessous). | `contact.html` |
| 🟠 Important | Tarifs (29 € / 69 € / 149 €) : ajustez-les. | `index.html` `#tarifs`, `ateliers.html` |
| 🟡 Confort | Liens Instagram / YouTube / Pinterest pointent vers les accueils des plateformes. | pied de page de chaque page |
| 🟡 Confort | Le portrait et les illustrations sont des SVG dessinés à la main. Remplaçables par de vraies photos. | `a-propos.html`, `index.html` |

---

## Structure

```
.
├── index.html            Accueil (hero, disciplines, méthode, tarifs, avis, FAQ)
├── ateliers.html         Détail des 4 parcours + formats
├── a-propos.html         Présentation de la coach + principes
├── contact.html          Formulaire de séance découverte
├── mentions-legales.html Mentions légales, confidentialité, CGV
├── 404.html              Page d'erreur (chemins absolus)
├── CNAME                 Domaine personnalisé pour GitHub Pages
├── .nojekyll             Désactive le traitement Jekyll
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/style.css     Feuille de style unique, organisée en 20 sections
    ├── js/main.js        Menu, thème, animations, formulaire
    └── img/favicon.svg
```

Aucune dépendance à installer. Les seules ressources externes sont les polices
Google Fonts (Bricolage Grotesque + Inter).

---

## Développement en local

Ouvrir `index.html` dans un navigateur suffit. Pour un vrai serveur local
(recommandé, car les chemins absolus de `404.html` ne marchent qu'ainsi) :

```powershell
# Python
python -m http.server 8000

# ou Node
npx serve .
```

Puis <http://localhost:8000>.

---

## Brancher le formulaire de contact

GitHub Pages ne sert que des fichiers statiques : il n'y a pas de serveur pour
recevoir un formulaire. Deux options.

**Option A — Formspree (gratuit jusqu'à 50 messages/mois)**

1. Créer un compte sur <https://formspree.io> et un nouveau formulaire.
2. Copier l'identifiant fourni (de la forme `xyzabcde`).
3. Dans `contact.html`, remplacer `VOTRE_ID_FORMSPREE` :

   ```html
   <form ... action="https://formspree.io/f/xyzabcde" method="POST">
   ```

4. Commit + push. L'envoi devient asynchrone, sans quitter la page.

**Option B — ne rien faire**

Tant que `VOTRE_ID_FORMSPREE` est présent, `main.js` bascule automatiquement sur
un `mailto:` pré-rempli vers `contact@skilloraa.shop`. Ça fonctionne, mais c'est
moins fluide pour le visiteur.

> L'adresse `contact@skilloraa.shop` doit exister. Namecheap propose une
> redirection e-mail gratuite (*Domain List → Manage → Redirect Email*) qui
> renvoie vers votre boîte personnelle.

---

## Déploiement

Le site est déployé automatiquement par GitHub Pages à chaque push sur `main`.

```powershell
git add -A
git commit -m "Mise à jour du contenu"
git push
```

Comptez une à deux minutes avant que le changement soit visible.

### Configuration DNS (Namecheap)

Dans *Domain List → Manage → **Advanced DNS***, supprimer les enregistrements
de parking par défaut, puis créer :

| Type | Host | Value | TTL |
|---|---|---|---|
| A Record | `@` | `185.199.108.153` | Automatic |
| A Record | `@` | `185.199.109.153` | Automatic |
| A Record | `@` | `185.199.110.153` | Automatic |
| A Record | `@` | `185.199.111.153` | Automatic |
| CNAME Record | `www` | `<utilisateur>.github.io.` | Automatic |

Ensuite, dans *Settings → Pages* du dépôt : renseigner `skilloraa.shop` comme
domaine personnalisé et cocher **Enforce HTTPS** une fois le certificat émis
(cela peut prendre jusqu'à 24 h après la propagation DNS).

Vérifier la propagation :

```powershell
nslookup skilloraa.shop
```

---

## Personnalisation rapide

**Couleurs** — tout est défini en variables CSS en haut de `assets/css/style.css` :

```css
:root {
  --accent:     #e2542c;  /* terracotta : boutons, accents */
  --accent-ink: #a8371a;  /* version foncée, pour le texte sur fond clair */
  --ink:        #14110f;  /* fonds sombres (hero, pied de page) */
  --paper:      #fbf8f4;  /* fond de page */
}
```

Le thème sombre est défini deux fois plus bas (`@media (prefers-color-scheme: dark)`
et `:root[data-theme="dark"]`) — pensez à modifier les deux.

**Polices** — remplacer le `<link>` Google Fonts dans chaque `<head>`, puis
`--font-display` et `--font-body`.

**Ajouter une page** — copier `contact.html`, vider le `<main>`, ajuster le
`<title>`, la balise `canonical`, le `aria-current="page"` dans la nav, et
ajouter l'URL à `sitemap.xml`.

---

## Accessibilité et performance

Déjà en place : lien d'évitement, navigation au clavier, `aria-*` sur le menu et
le formulaire, contrastes conformes AA, `prefers-reduced-motion` respecté, images
décoratives en `aria-hidden`, illustrations porteuses de sens avec `role="img"`
et un label.

Pas de framework, pas d'image bitmap, pas de tracker : le site tient en quelques
dizaines de kilo-octets.

---

## Licence

Code et contenus © Skilloraa. Tous droits réservés.
