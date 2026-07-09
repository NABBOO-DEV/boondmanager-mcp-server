// HAND-MAINTAINED overlay on top of the auto-generated boond-db-schema.ts.
// The generator (scripts/generate-db-schema.mjs) NEVER touches this file.
//
// Purpose: give the model the Nabboo-specific "grands champs" so it writes a
// correct ad-hoc SQL in ONE shot instead of probing tables/columns/values by
// trial-and-error. Surfaced first by the `boond_extractbi_schema` tool.
//
// Edit freely as you learn the data model. Keep it concise — it is injected
// into the model's context.
export const BOOND_SCHEMA_NOTES = `# BoondManager — guide SQL Nabboo (à lire AVANT d'écrire une requête)

## Contraintes du moteur ad hoc (boond_extractbi_query) — côté Boond, non contournables

VOCABULAIRE (ne pas confondre) : le plafond est de **10 LIGNES DE RÉSULTAT** renvoyées — c'est-à-dire 10 lignes de la sortie du SELECT, **PAS 10 enregistrements** de la base. Une ligne de résultat peut agréger des milliers d'enregistrements (ex. un COUNT sur 9000 candidats = 1 ligne de résultat). \`totalRows\` = nombre total de lignes de RÉSULTAT (candidats si liste détaillée, groupes si GROUP BY, 1 si COUNT global).

- Le plafond porte sur les lignes de RÉSULTAT affichées, PAS sur les données traitées : la requête s'exécute sur TOUTE la base. Les AGRÉGATS (COUNT/SUM/AVG/GROUP BY) sont donc EXACTS même quand seules 10 lignes s'affichent — fais confiance à un COUNT global.
- LIMIT/OFFSET sont IGNORÉS pour ce plafond. La pagination par KEYSET fonctionne (\`WHERE cle > derniere_vue ORDER BY cle\`, la clé = un id ou la colonne de GROUP BY), mais À MANIER AVEC PARCIMONIE.

RÈGLE DE DÉCISION (regarde totalRows AVANT toute itération — il est connu dès le 1er appel) :
- totalRows ≤ 10 → résultat complet, terminé.
- 10 < totalRows ≤ 50 → tu PEUX paginer par keyset (max **5 appels**) pour obtenir la liste complète.
- totalRows > 50 (a fortiori des centaines/milliers) → **NE PAGINE PAS** 10 par 10 (interdit d'itérer sur 9000 candidats par paquets de 10). À la place : AGRÈGE pour réduire le résultat à ≤10 lignes (GROUP BY par pôle, par mois, par responsable…), ou découpe par catégorie connue, ou — pour un export détaillé complet — propose d'enregistrer une requête ExtractBI dans l'UI Boond (téléchargeable en UN appel, CSV complet).
- Plafond dur : **jamais plus de 5 appels de pagination** pour une même question. Au-delà, change de stratégie (agréger ou requête enregistrée).
- **SELECT *** interdit → énumère les colonnes.
- Un seul SELECT, pas de ';' ni de commentaire SQL.

## Tables & champs clés (Nabboo — vérifiés)
- **TAB_PROFIL** = candidats ET ressources.
  - **PROFIL_MODEL** = 'candidate' | 'resource' → c'est LE discriminant candidat/ressource. (PIÈGE : PROFIL_TYPE ne le distingue PAS — les deux modèles se répartissent sur les mêmes PROFIL_TYPE. Ne filtre JAMAIS les candidats par PROFIL_TYPE.)
  - PROFIL_DATE = date de création. PROFIL_NOM / PROFIL_PRENOM = identité. PROFIL_STATUT = fonction/titre libre. PROFIL_ETAT = état (Int → dictionnaire).
  - FK : ID_POLE → pôle (= domaine d'expertise), ID_SOCIETE → agence (= entité Nabboo), ID_RESPMANAGER → responsable (TAB_USER).
- **TAB_USER** = comptes utilisateurs. ID_PROFIL relie le compte à SA fiche TAB_PROFIL (le NOM du user est là, pas sur TAB_USER).
- **TAB_POLE** (POLE_NAME) / **TAB_SOCIETE** (SOCIETE_RAISON) : voir concepts métier.

## Concepts métier Nabboo → où ils vivent (vérifiés)
- **Domaine d'expertise / filière = le PÔLE** : TAB_PROFIL.ID_POLE → TAB_POLE.POLE_NAME. 3 pôles réels : « Energies », « Défense - Spatial », « Sud-Est ». (Ce ne sont PAS des flags ni des business units — TAB_BUSINESSUNIT est vide.)
- **Entités Vacoa / Ginko / Navys = l'AGENCE** : TAB_PROFIL.ID_SOCIETE → TAB_SOCIETE.SOCIETE_RAISON. Valeurs : VACOA (majoritaire), NAVYS, GINKO, NABBOO.

## JOINs canoniques (copier-coller)
- **Nom du responsable** d'un candidat/ressource :
  \`FROM TAB_PROFIL PRF JOIN TAB_USER U ON PRF.ID_RESPMANAGER = U.ID_USER JOIN TAB_PROFIL MGR ON U.ID_PROFIL = MGR.ID_PROFIL\`
  → nom = \`CONCAT(MGR.PROFIL_PRENOM, ' ', MGR.PROFIL_NOM)\`.
- **Domaine d'expertise (pôle)** : \`JOIN TAB_POLE P ON PRF.ID_POLE = P.ID_POLE\` → \`P.POLE_NAME\`.
- **Entité (agence)** : \`JOIN TAB_SOCIETE S ON PRF.ID_SOCIETE = S.ID_SOCIETE\` → \`S.SOCIETE_RAISON\`.

## Recettes
- **Nouveaux candidats du mois par responsable ET pôle** — attention : ~9 managers × 3 pôles > 10 lignes → dépasse le plafond. Stratégie : soit GROUP BY sur UNE dimension, soit UNE requête PAR PÔLE (3 requêtes, chacune GROUP BY responsable, ≤10 lignes) :
  \`SELECT CONCAT(MGR.PROFIL_PRENOM,' ',MGR.PROFIL_NOM) AS responsable, COUNT(*) AS nb
   FROM TAB_PROFIL PRF
   JOIN TAB_USER U ON PRF.ID_RESPMANAGER=U.ID_USER
   JOIN TAB_PROFIL MGR ON U.ID_PROFIL=MGR.ID_PROFIL
   JOIN TAB_POLE P ON PRF.ID_POLE=P.ID_POLE
   WHERE PRF.PROFIL_MODEL='candidate' AND P.POLE_NAME='Défense - Spatial'
     AND PRF.PROFIL_DATE >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
     AND PRF.PROFIL_DATE <  DATE_FORMAT(CURDATE(), '%Y-%m-01')
   GROUP BY U.ID_USER ORDER BY nb DESC\`

## Encore à compléter (TODO)
- Mapping complet des états (PROFIL_ETAT) et des PROFIL_TYPE via boond_application_dictionary.
- Tables/JOINs récurrents : opportunités, projets (TAB_PROJET), factures (TAB_FACTURATION), CRA (TAB_TEMPS).
`;
//# sourceMappingURL=boond-schema-notes.js.map