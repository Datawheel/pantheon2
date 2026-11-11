/**
 * Trivia editorial policy: exclude people primarily associated with atrocities,
 * extremist leadership or propaganda, terrorism, or serial murder. Review
 * borderline cases individually; do not infer eligibility from HPI, nationality,
 * religion, political affiliation, or occupation alone.
 *
 * This is a maintained starter list, not an exhaustive classification. Add a
 * verified Pantheon person ID and an editorial reason when reviewing complaints.
 * IDs were checked against the public person_ranks API on 2026-11-11.
 * This policy applies only to trivia; historical profiles/rankings are unaffected.
 */
export const TRIVIA_EXCLUSIONS = [
  {id: 2731583, name: "Adolf Hitler", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 15641, name: "Joseph Stalin", reason: "Leadership of mass repression and state killings."},
  {id: 15777, name: "Joseph Goebbels", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 19527, name: "Mao Zedong", reason: "Leadership of campaigns involving mass persecution and deaths."},
  {id: 19283178, name: "Benito Mussolini", reason: "Fascist leadership and wartime atrocities."},
  {id: 6860726, name: "Jack the Ripper", reason: "Serial murder or orchestration of murders."},
  {id: 29490, name: "Saddam Hussein", reason: "Mass repression and atrocities against civilians."},
  {id: 13436, name: "Heinrich Himmler", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 84508, name: "Josef Mengele", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 13487, name: "Hermann Göring", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 19596649, name: "Adolf Eichmann", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 24326, name: "Pol Pot", reason: "Leadership of the Khmer Rouge genocide."},
  {id: 25914, name: "Reinhard Heydrich", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 29684300, name: "Rudolf Hess", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 20618, name: "Martin Bormann", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 22468, name: "Osama bin Laden", reason: "Terrorist leadership or mass-casualty terrorist violence."},
  {id: 42635, name: "Charles Manson", reason: "Serial murder or orchestration of murders."},
  {id: 16547, name: "Joachim von Ribbentrop", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 57731, name: "Leopold II of Belgium", reason: "Responsibility for atrocities in the Congo Free State."},
  {id: 143377, name: "Ted Bundy", reason: "Serial murder or orchestration of murders."},
  {id: 70842, name: "Idi Amin", reason: "Mass killings and persecution under his dictatorship."},
  {id: 83502, name: "Ernst Röhm", reason: "Nazi leadership, propaganda, or participation in Nazi atrocities."},
  {id: 319799, name: "Ayman al-Zawahiri", reason: "Terrorist leadership or mass-casualty terrorist violence."},
  {id: 16218, name: "Jeffrey Dahmer", reason: "Serial murder or orchestration of murders."},
  {id: 61279, name: "John Wayne Gacy", reason: "Serial murder or orchestration of murders."},
  {id: 33348100, name: "Abu Bakr al-Baghdadi", reason: "Terrorist leadership or mass-casualty terrorist violence."},
  {id: 32501324, name: "Anders Behring Breivik", reason: "Terrorist leadership or mass-casualty terrorist violence."},
  {id: 31535, name: "Timothy McVeigh", reason: "Terrorist leadership or mass-casualty terrorist violence."},
];

const excludedPersonIds = new Set(TRIVIA_EXCLUSIONS.map(({id}) => String(id)));

export function isTriviaPersonEligible(personId) {
  return personId != null && !excludedPersonIds.has(String(personId));
}
