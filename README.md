# Renginių planavimo ir užduočių valdymo sistema

### Sprendžiama problema
Renginių organizavimas apima daugybę užduočių, kurios turi būti paskirstytos komandos nariams ir stebimos dėl jų vykdymo progreso. Tačiau, be centralizuotos sistemos, sunku valdyti šias užduotis bendradarbiaujant, todėl dažnai pasitaiko pavėlavimų, nesusikalbėjimų ir neefektyvumo. Renginių organizatoriai dažnai susiduria su iššūkiais priskiriant atsakomybes, stebint užduočių vykdymą ir užtikrinant, kad visos būtinos užduotys būtų atliktos laiku.

### Sistemos tikslas
Šios sistemos tikslas – optimizuoti renginių planavimo procesą, sukuriant bendradarbiavimo platformą, kurioje renginių organizatoriai galėtų kurti renginius, priskirti užduotis konkretiems komandos nariams ir sekti jų vykdymo pažangą per reguliarius atnaujinimus. Sistema leis efektyviau koordinuoti renginio dalyvių veiksmus ir užtikrinti, kad visos užduotys būtų tinkamai valdomos, padidinant atsakomybę ir sumažinant klaidų ar pavėlavimų riziką.

### Funkciniai reikalavimai
1. **Renginio kūrimas ir valdymas**:
    - Vartotojai (nariai) gali sukurti naujus renginius, nustatyti renginio detales (pavadinimą, datą, aprašymą) ir pakviesti kitus narius dalyvauti.
    - Administratoriai gali peržiūrėti ir valdyti visus renginius.

2. **Užduočių priskyrimas ir sekimas**:
    - Renginio organizatoriai gali kurti su renginiu susijusias užduotis ir priskirti jas konkretiems renginio komandos nariams.
    - Kiekviena užduotis turi turėti aprašymą, atlikimo terminą ir būseną (Planuojama, Vykdoma, Atlikta).

3. **Užduočių atnaujinimai**:
    - Nariai, atsakingi už užduotis, gali paskelbti progreso atnaujinimus, pridėti komentarus ir keisti užduoties būseną vykdydami ją.
    - Kiekvienai užduočiai gali būti pridėta keletas atnaujinimų, leidžiančių stebėti užduoties vykdymo eigą.

4. **Vartotojų vaidmenys ir teisės**:
    - Sistema palaiko skirtingus vartotojų vaidmenis: **Svečias**, **Narys** ir **Administratorius**.
    - **Svečiai** gali peržiūrėti viešus renginius, bet negali valdyti užduočių.
    - **Nariai** gali kurti renginius, valdyti užduotis ir skelbti atnaujinimus.
    - **Administratoriai** turi visišką kontrolę renginių, užduočių ir vartotojų valdymo srityse.

5. **Užduočių priklausomybė ir perskirstymas**:
    - Organizatoriai gali perskirstyti užduotis kitiems nariams, jei reikia, ir užduotys gali turėti priklausomybę, kuri paveiktų jų vykdymo tvarką.

### Naudojamos technologijos
Front-end: React.js
Back-end: Express.js
