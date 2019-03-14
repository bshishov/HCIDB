//import {validateToken} from "@/services/auth";
import store from "@/store/index";

const GRAPHQL_ENDPOINT = 'https://hasura.shishov.me/v1alpha1/graphql';
const GRAPHQL_CONTENT_TYPE = 'application/json';

export default {
  query(query_string, variables = null) {
    let headers = {
      'content-type': GRAPHQL_CONTENT_TYPE
    };

    let idToken = store.state.session.idToken;
    if (idToken) {
      headers['authorization'] = 'Bearer ' + idToken;
    }

    return fetch(GRAPHQL_ENDPOINT, {
       method: 'POST',
       // TODO: get role from id_token!!
       headers: new Headers(headers),
       body: JSON.stringify({
         query: query_string,
         variables: variables
       })
    }).then(res => {
       return res.json();
    }).then(r => {
      if("data" in r) {
        return r.data;
      }
      return Promise.reject(r['errors']);
    });
  },
  getFeature(id) {
    console.log('[DB] Loading feature', {id});
    const getFeatureQuery = `
      query features_by_pk($id: Int) {
        features_by_pk(id: $id) {
          id name description
          depends { from { id name references { classifier { type_id content }} }}
          affects { to { id name references { classifier { type_id content }} }}
          references { classifier { id type { id name } content }}           
        }}`;
    return this.query(getFeatureQuery, {id: id}).then(r => {
      return r.features_by_pk;
    });
  },
  getClassifier(id) {
    console.log('[DB] Loading classifier', {id});
    const getClassifierQuery = `
      query classifiers_by_pk($id: Int) {
        classifiers_by_pk(id: $id) {
          id 
          content
          description
          type { id name }          
          references { feature { id name references { classifier { type_id content }} }}           
        }}`;
    return this.query(getClassifierQuery, {id: id}).then(r => {
      return r.classifiers_by_pk;
    });
  },
  getClassifierTypes() {
    console.log('[DB] Loading classifier types');
    const getClassifierTypesQuery = `{classifier_types {id name required}}`;
    return this.query(getClassifierTypesQuery).then(r => {
      return r['classifier_types'];
    })
  },
  updateFeature(id, changes) {
    console.log('[DB] Updating feature', {id, changes});
    const featureMutation =
      `mutation update_features($id: Int, $changes: features_set_input) {
        update_features(where: {id: {_eq: $id}}, _set: $changes) {
          affected_rows
          returning { id name description }    
        }}`;
    return this.query(featureMutation, {id: id, changes: changes})
      .then(r => {
        return r.update_features.returning[0];
      });
  },
  updateClassifier(id, changes) {
    console.log('[DB] Updating classifier', {id, changes});
    const classifierMutation =
      `mutation update_classifiers($id: Int, $changes: classifiers_set_input) {
        update_classifiers(where: {id: {_eq: $id}}, _set: $changes) {
          affected_rows
          returning { id content description type { id name }}    
        }}`;
    return this.query(classifierMutation, {id: id, changes: changes})
      .then(r => {
        return r.update_classifiers.returning[0];
      });
  },
  searchFeatures(query, limit=100) {
    const featureNameSearch =
      `query($q: String, $limit: Int = 100) {
        features(where: {name: {_ilike: $q}}, limit: $limit) 
        { 
          id
          name
          description
          affects { from_id to_id }
          depends { from_id to_id }
          references { classifier { type_id content }}
        }}`;
    return this.query(featureNameSearch, {q: '%' + query + '%', limit});
  },
  searchClassifiers(typeId, query) {
    const searchClassifiersQuery =
      `query($typeId: Int, $q: String) {
        classifiers(where: {content: {_ilike: $q}, type_id: {_eq: $typeId}}) 
        { 
          id content type { id name }
        }}`;
    return this.query(searchClassifiersQuery, {q: '%' + query + '%', typeId: typeId})
      .then(r => {
        return r.classifiers;
      });
  },
  addNewRelation(idFrom, idTo) {
    console.log('[DB] Adding new relation', {idFrom, idTo});
    const newRelationQuery =
      `mutation insert_relations($objects: [relations_insert_input!]!) {
        insert_relations(objects: $objects) {
          returning {            
            from_id
            to_id
            to { id name }
            from { id name }            
          }
        }
      }`;
    return this.query(newRelationQuery, {objects: [
        {to_id: idTo, from_id: idFrom}
      ]}).then(r => {
        return r.insert_relations.returning[0];
      });
  },
  addNewFeature(feature) {
    console.log('[DB] Adding new feature', {feature});
    const newFeatureQuery = `
      mutation insert_features($objects: [features_insert_input!]!) {
          insert_features(objects: $objects) {
          returning { id name description }
        }}`;
    return this.query(newFeatureQuery, {objects: [feature]})
      .then(r => {
        return r.insert_features.returning[0];
      });
  },
  addClassifier(typeId, content) {
    console.log('[DB] Adding new classifier', {typeId, content});
    const newClassifierMutation = `
      mutation insert_classifiers($objects: [classifiers_insert_input!]!) {
        insert_classifiers(objects: $objects) {
          returning { id content type { id name }}
        }}`;
    return this.query(newClassifierMutation, {objects: [{type_id: typeId, content: content}]})
      .then(r => {
        return r.insert_classifiers.returning[0];
      });
  },
  addReference(featureId, classifierId) {
    console.log("[DB] Adding new reference", {featureId, classifierId});
    const newReferenceMutation =
      `mutation insert_references($objects: [references_insert_input!]!) {
        insert_references(objects: $objects) {
          returning {            
            feature_id
            classifier_id
            classifier { id content type { id name }}            
          }
        }}`;
    return this.query(newReferenceMutation, {objects: [
        {feature_id: featureId, classifier_id: classifierId}
      ]}).then(r => {
        return r.insert_references.returning[0];
      });
  },
  deleteFeature(id) {
    console.log('[DB] Deleting feature', {id});
    const deleteFeatureQuery = `
      mutation delete_features($id: Int) {
        delete_features(where: {id: {_eq: $id}}) { 
          affected_rows 
        }
      }`;

    return this.query(deleteFeatureQuery, {id: id})
      .then(r => { return r.affected_rows; });
  },
  deleteClassifier(id) {
    console.log('[DB] Deleting classifier', {id});
    const deleteClassifierQuery = `
      mutation delete_classifiers($id: Int) {
        delete_classifiers(where: {id: {_eq: $id}}) { 
          affected_rows 
        }
      }`;

    return this.query(deleteClassifierQuery, {id: id})
      .then(r => { return r.affected_rows; });
  },
  deleteRelation(idFrom, idTo) {
    console.log('[DB] Deleting relation', {idFrom, idTo});
    const deleteRelationsQuery = `
      mutation delete_relations($idFrom: Int, $idTo: Int) {
        delete_relations(where: {
          to_id: {_eq: $idTo}, 
          from_id: {_eq: $idFrom}
        }) 
        { affected_rows }}`;

    return this.query(deleteRelationsQuery, {idFrom, idTo})
      .then(r => { return r.affected_rows; });
  },
  deleteReference(featureId, classifierId) {
    console.log('[DB] Deleting reference', {featureId, classifierId});
    const deleteReferenceQuery = `
      mutation delete_references($featureId: Int, $classifierId: Int) {
        delete_references(where: { 
              feature_id: {_eq: $featureId}, 
              classifier_id: {_eq: $classifierId}                        
          }) 
        { affected_rows }}`;

    return this.query(deleteReferenceQuery, {featureId, classifierId})
      .then(r => { return r.affected_rows; });
  },
}
