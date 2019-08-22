
<script>
    import { code } from "../../stores/code";

    let codeState;

    const unsubscribeCode = code.subscribe((_code) => {
        codeState = _code;
    });

    function onCodeChange(event) {
        codeState.slots[codeState.selectedSlot] = event.target.value;
        code.update(codeState);
    }

</script>

<textarea on:input={onCodeChange}></textarea>

