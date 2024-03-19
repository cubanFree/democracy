export function scrollDown({ ref }) {
    return ref?.current?.scrollIntoView();
}