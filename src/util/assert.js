export default function assert(invariant, msg) {
  if (!invariant) throw msg
}
