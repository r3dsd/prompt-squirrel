import { ipcMain } from 'electron';
import { AppModule } from '../AppModule.js';
import { ModuleContext } from '../ModuleContext.js';
import { categoryController } from '../controller/category.controller.js';
import { configController } from '../controller/config.controller.js';
import { electronController } from '../controller/electron.controller.js';
import { fileTransferController } from '../controller/file-transfer.controller.js';
import { promptController } from '../controller/prompt.controller.js';
import { tagController } from '../controller/tag.controller.js';

class IPCModule implements AppModule {
    async enable({ app }: ModuleContext) {
        await app.whenReady();

        registerIpc('electron', electronController);
        registerIpc('category', categoryController);
        registerIpc('tag', tagController);
        registerIpc('prompt', promptController);
        registerIpc('transfer', fileTransferController);
        registerIpc('config', configController);
    }
}

function registerIpc<T extends object>(channel: IPCChannels, controller: T) {
    const prototype = Reflect.getPrototypeOf(controller);
    if (!prototype)
        throw new Error(`Controller for IPC channel "${channel}" does not have a prototype.`);

    const methods = Reflect.ownKeys(prototype).filter(
        (name): name is string & keyof T =>
            // biome-ignore lint/suspicious/noExplicitAny: 유틸 함수로서 any를 사용합니다.
            name !== 'constructor' && typeof (controller as any)[name] === 'function',
    );
    console.log(`Registering IPC channels for ${channel}:`, methods);

    for (const methodName of methods) {
        const ipcChannelName = `${channel}:${methodName}`;
        console.log(`  - Registering ${ipcChannelName}`);
        ipcMain.handle(ipcChannelName, (_, ...args: unknown[]) =>
            // biome-ignore lint/suspicious/noExplicitAny: 유틸 함수로서 any를 사용합니다.
            (controller as any)[methodName](...args),
        );
    }
}

export function ipcModule(): IPCModule {
    return new IPCModule();
}
