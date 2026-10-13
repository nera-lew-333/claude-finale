# claude-finale

A fireworks finale over the Dubai skyline that plays in Lewis's Claude chats when a task is finished. It spells a short word in fireworks and shows one line saying what got done.

Only animation code lives here. Claude loads it from jsDelivr inside a chat widget:

```html
<div data-nera-finale data-word="DONE" data-caption="What got finished"></div>
<script src="https://cdn.jsdelivr.net/gh/nera-lew-333/claude-finale@1.0.0/finale.js"></script>
```
