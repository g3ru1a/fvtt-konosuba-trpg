export default function registerHelpers(){
    Handlebars.registerHelper("ability", function (abilityString) {
        abilityString = abilityString.toLowerCase();
        return "konosuba.abilities." + abilityString;
    });
    Handlebars.registerHelper("key", function (array, key) {
        return array[key] != 0 ? array[key] : "";
    });
    Handlebars.registerHelper("abilityBonus", function (bas) {
        if (!bas) return;
        return Math.floor(bas / 3);
    });
    Handlebars.registerHelper("baseAbilityScore", function (race, key) {
        if(!race) return;
        return race.data.attrs[key]
    });
    Handlebars.registerHelper("abilityScore", function (classMod, abilityBonus) {
        if (!classMod) classMod = 0;
        if (!abilityBonus) abilityBonus = 0;
        return abilityBonus + classMod;
    });
}