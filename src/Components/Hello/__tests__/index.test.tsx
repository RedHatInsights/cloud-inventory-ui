import React from "react"
import { render, screen } from '@testing-library/react';
import { Hello } from '..';

it('Renders hello for given name', () => {
    const name = 'Test';

    render(<Hello name={name} />)
    expect(screen.getByText(`Hello, ${name}`)).toBeInTheDocument();
})