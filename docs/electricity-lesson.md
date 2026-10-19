# Άναψε τη λάμπα — electricity lesson

Status: lesson structure, Greek copy, and detailed behaviour confirmed by the project owner on 2026-10-19, including immediate workshop feedback and explicit testing in the final challenge. Planning only, with no application changes.

## Learning goal and confirmed structure

Children investigate how a complete conducting path connects opposite battery poles to separate bulb terminals. They predict, modify a circuit, explain an observation, and apply the idea to a new arrangement. Completing this activity records participation, not certified mastery.

Confirmed by the project owner:

- Help Σπίθα light a small battery-powered lamp in the lighthouse workshop.
- Predict whether a bulb will light with only one wire connected.
- Keep that wire when entering the experiment; allow children to complete or change the circuit.
- Choose among three short explanations while the completed circuit remains visible.
- Finish by building from scratch with the battery and bulb repositioned.

Audience: Greek-speaking children aged 8–12. Preserve the original Σπίθα and island artwork, Noto Sans, and the established palette. The small workshop lamp is the experiment; do not imply that the battery powers the real lighthouse or repaint the island artwork to show success.

## 1. Story

**Title:** «Άναψε τη λάμπα»

**Σπίθα:** «Καλώς ήρθες στο εργαστήριο του φάρου! Έχω μια μικρή λάμπα, μια μπαταρία και δύο καλώδια. Θέλεις να με βοηθήσεις να ανάψω τη λάμπα;»

**Primary action:** «Ας εξερευνήσουμε!»

Show the experiment components without revealing the working connection. Use a virtual battery throughout; household electricity is not part of the activity.

## 2. Prediction

Show exactly one wire from the battery's positive pole to bulb terminal A. The negative pole and bulb terminal B are visibly unconnected. The circuit is a static prediction illustration; no animated electrical flow or success feedback.

**Prompt:** «Θα ανάψει η λάμπα με αυτή τη σύνδεση;»

**Choices:** «Ναι» · «Όχι» · «Δεν είμαι σίγουρος/η»

**Supporting copy:** «Διάλεξε τι πιστεύεις. Μετά θα το δοκιμάσουμε.»

**Primary action after selection:** «Ας το δοκιμάσουμε»

Store the submitted prediction, including uncertainty, before entering the experiment. All choices proceed. Do not label the prediction correct or incorrect or highlight the missing connection yet. Revisiting this stage must not overwrite the original submission.

## 3. Build and observe

Carry the identical one-wire arrangement into the live experiment. First show the observation: «Με αυτή τη σύνδεση, η λάμπα μένει σβηστή.»

**Task:** «Μπορείς να αλλάξεις τις συνδέσεις ώστε να ανάψει;»

**Control instruction:** «Πάτησε μία επαφή και μετά μια δεύτερη για να τις συνδέσεις.»

Use the same interaction with keyboard focus and Enter/Space. Selecting the same terminal again cancels the pending selection. Include «Αναίρεση», «Βοήθεια», and a secondary «Αφαίρεση όλων των καλωδίων» control. Removing wires affects only the current board, never saved evidence or the profile; undo can restore the previous board.

The bulb responds to accepted wiring changes. Provide a text state alongside the visual: «Η λάμπα είναι σβηστή» or «Η λάμπα είναι αναμμένη». Wire colours and animation are not the only feedback.

**Success:** «Η λάμπα άναψε! Ας δούμε τι άλλαξε.»

**Primary action after success:** «Γιατί άναψε;»

Save the working arrangement when advancing, and display it unchanged during the explanation. Do not auto-advance when the bulb lights; allow observation and further experiments first. If the child breaks the circuit again, the explanation action becomes available again once a working arrangement is restored.

### Connection feedback

| Event | Greek feedback | Behaviour |
| --- | --- | --- |
| A terminal selected | «Τώρα διάλεξε τη δεύτερη επαφή.» | Identify the selected terminal visually and to assistive technology. |
| Duplicate wire | «Αυτές οι επαφές είναι ήδη συνδεδεμένες.» | Keep the board unchanged. |
| Wire-only battery short | «Αυτή η σύνδεση ενώνει τους πόλους της μπαταρίας χωρίς να περνά από τη λάμπα. Δοκίμασε άλλη σύνδεση.» | Reject the wire; retain previous valid wiring. |
| Two wires already placed | «Έχεις χρησιμοποιήσει και τα δύο καλώδια. Πάτησε “Αναίρεση” για να αλλάξεις μια σύνδεση.» | Keep the board unchanged. |

Feedback must describe the actual circuit. Do not describe every failed arrangement as merely a missing wire.

### Optional help

1. **Verbal cue:** «Παρατήρησε τη μπαταρία και τη λάμπα. Ποιες επαφές δεν έχουν συνδεθεί ακόμη;» Use this only when adding a valid wire can complete the circuit. Otherwise say «Ας αλλάξουμε μια σύνδεση. Πάτησε “Αναίρεση” και δοκίμασε μια διαφορετική επαφή της λάμπας.»
2. **Highlight:** «Δοκίμασε να ενώσεις αυτές τις δύο επαφές.» Highlight a valid next connection, using an equivalent spoken description. If a wire must first be removed, guide that correction before highlighting a connection.
3. **Optional demonstration:** Offer «Δείξε μου μία σύνδεση». Add one explicitly requested valid connection, then return control to the child. Do not silently complete the board or overwrite the entire arrangement.

Count each hint and demonstration as assistance. Success feedback remains encouraging regardless of help used. The same help is available in the fresh challenge and recorded separately there.

## 4. Explain

Keep the child's working circuit visible. Ask before showing the correct explanation or tracing the complete path.

**Question:** «Γιατί άναψε η λάμπα;»

**Answer choices, in this stable order:**

1. «Επειδή ένα καλώδιο αγγίζει τη λάμπα.»
2. «Επειδή υπάρχει μια ολόκληρη διαδρομή από τον έναν πόλο της μπαταρίας, μέσα από τη λάμπα, ως τον άλλο πόλο.»
3. «Επειδή η λάμπα βρίσκεται κοντά στην μπαταρία.»

**Primary action:** «Έλεγξε την απάντηση»

Choice 2 is correct. Record the first submitted answer separately from later tries.

- **For choice 1:** «Στην αρχή είχαμε ένα καλώδιο, αλλά η λάμπα έμενε σβηστή. Παρατήρησε τη διαδρομή τώρα και δοκίμασε ξανά.»
- **For choice 3:** «Η απόσταση από την μπαταρία δεν αρκεί για να ανάψει η λάμπα. Παρατήρησε τις συνδέσεις και δοκίμασε ξανά.»
- **For choice 2:** «Ακριβώς! Το ηλεκτρικό κύκλωμα είναι κλειστό: υπάρχει μια ολόκληρη αγώγιμη διαδρομή μέσα από τη λάμπα και την μπαταρία.»

After a correct response, highlight the complete loop without implying that electricity gets used up in the bulb or requiring a particular bulb-terminal polarity. Use a static highlight under reduced motion. Offer «Μια νέα δοκιμή» to continue.

If the child requests the answer, show the explanation as assistance and permit continuation. Record an explained/assisted outcome rather than inventing a correct independent response. There are no timed retries or punitive scores.

## 5. Fresh challenge

Reposition the battery and bulb without changing their identities or terminal labels. Begin with no wires. Use an arrangement where both components and all terminals remain visible and reachable on phones.

**Σπίθα:** «Άλλαξα θέση στη μπαταρία και στη λάμπα. Μπορείς να φτιάξεις πάλι ένα κύκλωμα που ανάβει τη λάμπα;»

**Instruction:** «Σύνδεσε τις επαφές με τα δύο καλώδια. Όταν είσαι έτοιμος/η, δοκίμασε το κύκλωμά σου.»

**Primary action:** «Δοκίμασε το κύκλωμα»

Unlike the free experiment, this challenge evaluates on an explicit test action so the first submitted arrangement is identifiable. Before testing, label the bulb state «Δεν έχει δοκιμαστεί ακόμη». After any edit, clear the previous test result and show «Οι συνδέσεις άλλαξαν. Δοκίμασε ξανά.» Never leave a stale lit bulb after the wiring changes.

Record the first submitted wiring snapshot and its result, plus assistance used up to that point. Record later tests separately. Rejected invalid wires are interaction events, not completed tests. Accept either valid polarity-to-terminal pairing; do not require the original wire order or a memorized screen position.

- **Not lit:** «Η λάμπα δεν άναψε ακόμη. Έλεγξε τις συνδέσεις και δοκίμασε ξανά.» Keep wiring editable and offer optional help.
- **Lit:** «Η λάμπα άναψε ξανά! Η θέση των εξαρτημάτων άλλαξε, αλλά η ολόκληρη διαδρομή παρέμεινε απαραίτητη.»

**Action after success:** «Τι ανακαλύψαμε;»

Help and demonstrations remain available; completing with help is a valid supported outcome, stored honestly.

## 6. Completion

**Title:** «Ολοκλήρωσες την αποστολή!»

**Summary:** «Δοκίμασες πώς ανάβει μια λάμπα. Στο κύκλωμά μας χρειάζεται μια ολόκληρη διαδρομή: από τον έναν πόλο της μπαταρίας, μέσα από τη λάμπα, ως τον άλλο πόλο.»

**Primary action:** «Πίσω στο νησί»

**Secondary action:** «Παίξε ξανά»

Mark the mission completed. Do not award mastery labels, penalize assistance, or lock/unlock other topics. Replay starts a new run while keeping the original prediction, first explanation, first challenge test, assistance record, and earlier completed runs.

## Continuity and implementation boundaries

- Save per profile after meaningful changes: prediction submission, wiring changes, hints/demonstrations, explanation submissions, challenge tests, and stage transitions. Resume the exact stage and arrangement after refresh or leaving the lesson.
- Keep original first evidence, current-run evidence, retry histories, and completed-run summaries distinct. The seeded first wire is part of the lesson, not assistance; completing the guided board is not an independent from-scratch build.
- On save failure, show «Δεν μπορέσαμε να αποθηκεύσουμε την πρόοδό σου. Αν κλείσεις τη σελίδα, μπορεί να χαθεί.» Offer a save retry without discarding in-memory work. Announce successful saving only after it succeeds.
- Preserve the existing circuit rules: opposite battery poles must connect to separate bulb terminals; reject direct and indirect wire-only battery shorts. The bulb's internal path is not itself a short.
- Keep descriptive terminal labels, screen-reader topology, visible focus, live text feedback, and tap/keyboard controls. Any path highlighting must have a textual equivalent. Support changes preserve all state.
- The Greek copy is approved; verify the implemented diagrams against this lesson before release. This is a qualitative single-battery, single-bulb model; it introduces no current calculations or validated educational-outcome claims.
- Local-profile storage, legacy import, and the exact saved-data schema remain separate implementation decisions. Do not migrate or erase existing progress as part of this lesson plan.
