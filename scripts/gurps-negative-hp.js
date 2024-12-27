
  /* -------------------------------------------- */


  Hooks.once("init", () => {
    console.log("GURPS Negative HP | Initializing GURPS Negative HP module");

  /**
   * Handle how changes to a Token attribute bar are applied to the Actor.
   * This allows for game systems to override this behavior and deploy special logic.
   * @param {string} attribute    The attribute path
   * @param {number} value        The target attribute value
   * @param {boolean} isDelta     Whether the number represents a relative change (true) or an absolute change (false)
   * @param {boolean} isBar       Whether the new value is part of an attribute bar, or just a direct value
   * @returns {Promise<documents.Actor>}  The updated Actor document
   */
    Actor.prototype.modifyTokenAttribute = async function(attribute, value, isDelta=false, isBar=true) {
      const attr = foundry.utils.getProperty(this.system, attribute);
      const current = isBar ? attr.value : attr;
      const update = isDelta ? current + value : value;
      if ( update === current ) return this;
  
      // Determine the updates to make to the actor data
      let updates;
      if ( isBar ) updates = {[`system.${attribute}.value`]: Math.min(update, attr.max)};
      else updates = {[`system.${attribute}`]: update};
  
      // Allow a hook to override these changes
      const allowed = Hooks.call("modifyTokenAttribute", {attribute, value, isDelta, isBar}, updates);
      return allowed !== false ? this.update(updates) : this;
    }
  });
