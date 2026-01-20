let spritesWithHitboxes: Array<Sprite> = []
let hitBoxesForSprites: Array<Array<number>> = []
//% block="Hitboxes"
//% color=#00aa00
//% icon="\uf096"
namespace hitboxes {
    //% block="Create a hitbox for sprite $sprite"
    export function create(sprite: Sprite){
        if(spritesWithHitboxes.indexOf(sprite)!=-1){
            throw "Sprite already has a hitbox"
        }
        spritesWithHitboxes.push(sprite)
        hitBoxesForSprites.push([0,0,sprite.width,sprite.height])
    }
    //% block="Set parameters of hit box of $sprite to offsets x $xoff y $yoff width $w height $h"
    export function setParameters(sprite: Sprite, xoff: number, yoff: number, w: number, h: number){
        if (spritesWithHitboxes.indexOf(sprite) == -1) {
            throw "Sprite doesn't have a hitbox yet"
        }
        hitBoxesForSprites[spritesWithHitboxes.indexOf(sprite)]=[xoff,yoff,w,h]
    }
    //% block="Is $hittingsprite hitting the hitbox of $sprite"
    export function isHitting(hittingsprite: Sprite, sprite: Sprite){
        let hitbox: Array<number> = hitBoxesForSprites[spritesWithHitboxes.indexOf(sprite)]
        let x = sprite.left-hitbox[0]
        let y = sprite.top - hitbox[1]
        let w = hitbox[2]
        let h = hitbox[3]
        return hittingsprite.right > x &&
            hittingsprite.left < x + w && 
            hittingsprite.bottom > y && 
            hittingsprite.top < y + h    
        }
    //% block="Is the hitbox of $hittingsprite hitting the hitbox of $sprite"
    export function areHitting(hittingsprite: Sprite, sprite: Sprite){
        let hitbox: Array<number> = hitBoxesForSprites[spritesWithHitboxes.indexOf(sprite)]
        let x = sprite.left - hitbox[0]
        let y = sprite.top - hitbox[1]
        let w = hitbox[2]
        let h = hitbox[3]
        let hittingHitbox: Array<number> = hitBoxesForSprites[spritesWithHitboxes.indexOf(hittingsprite)]
        let hx = hittingsprite.left - hittingHitbox[0]
        let hy = hittingsprite.top - hittingHitbox[1]
        let hw = hittingHitbox[2]
        let hh = hittingHitbox[3]
        return hx+hw > x &&
            hx < x + w &&
            hy+hh > y &&
            hy < y + h
    }
    //% block="Get the side the hitbox $hittingsprite is hitting the hitbox of $sprite"
    export function getSideOfCollision(hittingsprite: Sprite, sprite: Sprite): string {
        if (hitboxes.areHitting(hittingsprite, sprite)) {
            let hitbox: Array<number> = hitBoxesForSprites[spritesWithHitboxes.indexOf(sprite)]
            let x = sprite.left - hitbox[0]
            let y = sprite.top - hitbox[1]
            let w = hitbox[2]
            let h = hitbox[3]
            let hittingHitbox: Array<number> = hitBoxesForSprites[spritesWithHitboxes.indexOf(hittingsprite)]
            let hx = hittingsprite.left - hittingHitbox[0]
            let hy = hittingsprite.top - hittingHitbox[1]
            let hw = hittingHitbox[2]
            let hh = hittingHitbox[3]
            let dx = (hx + hw / 2) - (x + w / 2)
            let dy = (hy + hh / 2) - (y + h / 2)
            let width = (hw + w) / 2
            let height = (hh + h) / 2
            let crossWidth = width * dy
            let crossHeight = height * dx
            if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
                if (crossWidth > crossHeight) {
                    if (crossWidth > (-crossHeight)){
                        return "bottom"
                    }else{
                        return "left"
                    }
                } else {
                    if (crossWidth > (-crossHeight)){
                        return "right"
                    }else{
                        return "top"
                    }
                }
            }
        }
        return null
    }
    //% blockId=on_hitbox_collide
    //% block="On the hitbox of $sprite of kind $kind hits the hitbox of $otherSprite of kind $kind2 do"
    //% kind.shadow=spritekind
    //% kind2.shadow=spritekind
    //% thendo.handlerStatement=1
    //% draggableParameters="reporter"
    export function onHitboxCollide(kind: number, kind2: number, thendo: (sprite: Sprite, otherSprite: Sprite) => void){
        game.onUpdate(function(){
        for(let b of sprites.allOfKind(kind)){
            for(let h of sprites.allOfKind(kind2)){
                if(b==h){
                    continue
                }
                if(hitboxes.areHitting(b,h)){
                    thendo(b,h)
                }
            }
            }
        })
    }
}