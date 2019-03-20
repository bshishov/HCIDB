import db from "@/services/db";

class Reference {
  constructor(params) {
    this.featureId = params.feature_id || undefined;
    this.classifierId = params.classifier_id || undefined;
    this.created = params.created || undefined;

    if(!!params.classifier) {
      this.classifier = new Classifier(params.classifier);
    } else {
      this.classifier = undefined;
    }

    if(!!params.feature) {
      this.feature = new Classifier(params.feature);
    } else {
      this.feature = undefined;
    }
  }
}

class Relation {
  constructor(params) {
    this.fromId = params.from_id || undefined;
    this.toId = params.from_id || undefined;
    this.created = params.created || undefined;

    if (!!params.from) {
      this.from = new Feature(params.from);
    } else {
      this.from = undefined;
    }

    if (!!params.to) {
      this.from = new Feature(params.to);
    } else {
      this.to = undefined;
    }
  }
}

class ClassifierType {
  constructor(params) {
    this.id = params.id || undefined;
    this.name = params.name || undefined;
    this.required = params.required || undefined;

    if(!!params.classifiers) {
      this.classifiers = params.classifiers.map(c => new Classifier(c));
    } else {
      this.classifiers = undefined;
    }
  }

  static all() {
    db.getClassifierTypes()
      .then(results => results.map(cType => new ClassifierType(cType)));
  }
}

class Classifier {
  constructor(params) {
    this.id = params.id || undefined;
    this.content = params.content || undefined;
    this.typeId = params.type_id || undefined;
    this.description = params.description || undefined;
    this.created = params.created || undefined;

    if (!!params.type) {
      this.type = new ClassifierType(params.type);
    } else {
      this.type = undefined;
    }
  }

  static getById(id) {
    db.getClassifier(id)
      .then(classifier => new Classifier(classifier));
  }

  static search(typeId, query) {
    return db.searchClassifiers(typeId, query)
      .then(classifiers => classifiers.map(classifier => new Classifier(classifier)));
  }
}

class Feature {
  constructor(params) {
    this.id = params.id || undefined;
    this.name = params.name || undefined;
    this.description = params.description || undefined;
    this.created = params.created || undefined;

    if(!!params.references) {
      this.references = params.references.map(r => new Reference(r));
    } else {
      this.references = undefined;
    }

    if(!!params.affects) {
      this.affects = params.affects.map(r => new Relation(r));
    } else {
      this.affects = undefined;
    }

    if(!!params.depends) {
      this.depends = params.depends.map(r => new Relation(r));
    } else {
      this.depends = undefined;
    }

    // Meta - information
    this.meta = params.meta || {};
  }

  get classifiers() {
    if(this.references === undefined)
      return undefined;

    return this.references.map(r => r.classifier);
  }

  static getById(id) {
    return db.getFeature(id)
      .then(feature => new Feature(feature));
  }

  static search(query) {
    return db.searchFeatures(query)
      .then(r => r.features.map(feature => new Feature(feature)));
  }
}

export {
  Feature
}
