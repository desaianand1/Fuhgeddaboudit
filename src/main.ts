import { getReplacementPhrase, keywordMap } from "./data";

const possibleNodes = document.body.querySelectorAll("*:not(script):not(noscript):not(style)");

function isTextNode(node:Node):boolean{
    return node.nodeType === Node.TEXT_NODE;
}

function replaceMatchedText(textNode:ChildNode){

}

possibleNodes.forEach((node)=> {
    [...node.childNodes]
    .filter(isTextNode)
    .forEach((textNode)=> {
        if(textNode.textContent!== null){
            const sentence = textNode.textContent.toLowerCase();
            const parentEl = textNode.parentElement;
            // 1. Check if keyword map contains individual words
            const words =  sentence.split(" ");
            words?.forEach(word=>{
                if(keywordMap.has(word)){
                    parentEl?.classList.add("text-fade-out");
                    textNode.textContent = textNode.textContent!!.replaceAll(word,getReplacementPhrase(word,true));
                    // parentEl?.onanimationend?
                }
            })
    
            // 2. Check if sentence contains keyphrases.
           
        }
        
    })
});