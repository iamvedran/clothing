import { initializeApp, } from 'firebase/app'
import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    
} from 'firebase/auth'
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    writeBatch,
    query,
    getDocs
} from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA1GT2CSSR5rv7JnhhkEaQOngrb5AFnaIg",
    authDomain: "crwn-db-db65d.firebaseapp.com",
    databaseURL: "https://crwn-db-db65d.firebaseio.com",
    projectId: "crwn-db-db65d",
    storageBucket: "crwn-db-db65d.appspot.com",
    messagingSenderId: "129310106385",
    appId: "1:129310106385:web:ff9f7322c2f3b40d29a2b0",
    measurementId: "G-EWNB38360S"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = collection(db, collectionKey);
    const batch = writeBatch(db);

    objectsToAdd.forEach((object)=>{
        const docRef = doc(collectionRef, object.title.toLowerCase());
        batch.set(docRef, object);
    })

    await batch.commit();
    console.log('done');

}

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
    if (!userAuth) { return; }

    const userDocRef = doc(db, 'users', userAuth.uid);

    const userSnapshot = await getDoc(userDocRef);
    console.log(userSnapshot.exists());

    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName, email, createdAt, ...additionalInformation
            });
        } catch (error) {
            console.log("error creating user", error.message);
        }

        return userDocRef;

    }
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) { return };

    return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) { return };

    return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth); 

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

export const getCategoriesAndDocuments = async () =>{
    const collectionRef = collection(db,  'categories');
    const q = query(collectionRef);

    const  querySnapshot  = await getDocs(q);
    const categoryMap =  querySnapshot.docs.reduce((acc, docSnapshot)=>{
        const { title, items } = docSnapshot.data();
        acc[title.toLowerCase()] = items;

        return acc;
    },{});

    return categoryMap;
}