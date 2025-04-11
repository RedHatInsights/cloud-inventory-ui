import { Text } from "@patternfly/react-core"
import React from "react"

interface HelloProps {
    name: string
}

export const Hello = ({name}: HelloProps) => (
    <Text component="p">Hello, {name}</Text>
)