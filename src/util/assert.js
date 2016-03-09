export default function assert(invariant, msg) {
  if (!invariant) {
    throw new Error(msg)
  }
}
