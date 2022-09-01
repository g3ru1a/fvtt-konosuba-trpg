export default class CharacterSheet extends ActorSheet {
    async getData() {
        const data = super.getData()
        const abilityData = this.computeAbilityData();
        let race = data.items.find((i) => i.type == "race");
        let currentClass = data.items.find((i) => i.type == "class");

        // console.log(data.actor.data.data.attributes);

        let sheetData = {
            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: this.actor,
            data: data.actor.data.data,
            config: CONFIG.konosuba,
            race,
            currentClass,
            abilityData
        };
        return sheetData;
    }

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/konosuba/templates/sheets/character-sheet.hbs",
            classes: ["konosuba", "character-sheet"],
            tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "description" }],
            width: 860,
            height: 1200,
        });
    }

    activateListeners(html) {
        if (this.isEditable) {
            html.find(".item-edit").click(this._onItemSelect.bind(this));
            html.find(".delete-icon").click(this._onItemRemove.bind(this));
        }

        super.activateListeners(html);
    }

    async  updateBaseHPMP(){
        let currentClass = this.actor.items.find((i) => i.type == "class");
        currentClass = currentClass ? currentClass.data : undefined;
        let bas = this.computeAbilityData().bas;
        let str = bas.str;
        let mnd = bas.mnd;
        let starting_hp =
            currentClass && currentClass.data.isStartingClass
                ? currentClass.data.starting_hp
                : this.actor.data.data.attributes.hp.starting;
        let starting_mp =
            currentClass && currentClass.data.isStartingClass
                ? currentClass.data.starting_mp
                : this.actor.data.data.attributes.mp.starting;
        let skill_mod_hp = 0;
        let skill_mod_mp = 0;
        let hp = starting_hp + str + skill_mod_hp;
        let mp = starting_mp + mnd + skill_mod_mp;

        await this.actor.update({
            "data.attributes.hp.starting": starting_hp,
            "data.attributes.mp.starting": starting_mp,
            "data.attributes.hp.max": hp,
            "data.attributes.mp.max": mp,
        });
    }

    computeAbilityData(){
        let actorData = this.actor.data.data;
        let race = this.actor.items.find((i) => i.type == "race");
        let currentClass = this.actor.items.find((i) => i.type == "class");

        let abilityKeys = Object.keys(actorData.abilities);
        let bas = [],
            ab = [],
            cm = [],
            score = [];

        abilityKeys.forEach(key => {
            let classMod = (currentClass) ? currentClass.data.data.mods[key] : 0;
            let raceMod = (race) ? race.data.data.attrs[key] : 0;
            bas[key] = raceMod + actorData.abilities[key].bonus + actorData.abilities[key].old_class_mod;

            ab[key] = Math.floor(bas[key]/3);
            cm[key] = classMod;
            score[key] = ab[key] + cm[key];
        });

        return {
            bas,
            ab,
            cm,
            score,
        };
    }

    _onItemSelect(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.dataset.itemId;
        let item = this.actor.items.get(itemId);
        if (item == undefined) {
            console.warn("Konosuba | Undefined Item");
            return;
        }
        item.sheet.render(true);
        return;
    }

    _onItemRemove(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.dataset.itemId;
        let item = this.actor.items.get(itemId);
        if(item) item.delete();
    }

    /** @override */
    async _onDropItemCreate(itemData) {
        let items = itemData instanceof Array ? itemData : [itemData];
        let actor = this.actor;
        let updateHPMP = false;
        if((actor.items.filter(i => i.type == "class").length == 0 &&
            items.filter(i => i.type == "class").length > 0) || 
            items.filter(i => i.type == "class").length == 0){
            updateHPMP = true;
        }

        //Allow only one race at a time
        items = this.onlyOneItemOfType("race", actor, items);
        items = this.onlyOneItemOfType("class", actor, items);

        if(items.filter(item => item.type == "class").length > 0 && updateHPMP){
            let ind = items.findIndex((item) => item.type == "class");
            console.log(items[ind]);
            items[ind].data.isStartingClass = true;
        }

        // Create the owned items as normal
        let ced = await this.actor.createEmbeddedDocuments("Item", items);

        if (updateHPMP) {
            await this.updateBaseHPMP();
        }

        return ced;
    }

    onlyOneItemOfType(type, actor, items){
        let hasType = actor.items.filter((item) => item.type == type).length > 0;
        let typeItem = items.find((item) => item.type == type);
        if (hasType && typeItem) {
            let currentItemOfType = actor.items.find((item) => item.type == type);
            currentItemOfType.delete();
            items = items.filter((item) => item.type != type);
            items.push(typeItem);
        }
        return items;
    }
}
