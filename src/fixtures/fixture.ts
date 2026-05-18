import { test as base } from '@playwright/test';

type Fixture = {
}

type WorkerFixture = {
}

export const test = base.extend<Fixture, WorkerFixture>({
})