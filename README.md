# claude-finale

Small chat widgets for Lewis's Claude chats, loaded from jsDelivr inside a chat widget.

`nera.js` draws two things:

- A fireworks finale over the Dubai skyline when a task is finished. It spells a short word in fireworks and shows one line saying what got done.
- Up to four clickable next steps. Clicking one sends it as the next message.

```html
<div data-nera-finale data-word="DONE" data-caption="What got finished"></div>
<div data-nera-next data-steps="First step|Second step|Third step"></div>
<script src="https://cdn.jsdelivr.net/gh/nera-lew-333/claude-finale@1.1.0/nera.js"></script>
```

Either element works on its own. `finale.js` is the original fireworks only version, kept for older chats.
