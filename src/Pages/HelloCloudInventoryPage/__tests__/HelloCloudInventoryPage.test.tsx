import React from 'react'
import { render, screen } from "@testing-library/react"
import HelloCloudInventory from "../HelloCloudInventoryPage"

it('Renders hello page', () => {
    render(<HelloCloudInventory />)
    expect(screen.getByText('Hello, Cloud Inventory')).toBeInTheDocument();
})