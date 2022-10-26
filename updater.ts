import {  }from "https://deno.land/std@0.160.0/fs/mod.ts"

enum System {
    WINDOWS, LINUX
}

export async function getVersion(system: System): Promise<string> {
    const versionPage = await fetch(new URL('https://minecraft.net/en-us/download/server/bedrock/'))
    const versionPageText = await versionPage.text()
    const LINUX_REGEX = /https:\/\/minecraft.azureedge.net\/bin-linux\/bedrock-server-(\d+\.\d+\.\d+\.\d+)\.zip/
    const WIN_REGEX = /https:\/\/minecraft.azureedge.net\/bin-win\/bedrock-server-(\d+\.\d+\.\d+\.\d+)\.zip/
    const regex = system === System.WINDOWS ? WIN_REGEX : LINUX_REGEX
    const match = versionPageText.match(regex)
    if (!match) {
        throw new Error('Could not find version')
    }
    return match[1]
}

export async function downloadVersion(version: string, system: System): Promise<void> {
    const url = `https://minecraft.azureedge.net/bin-${system === System.WINDOWS ? 'win' : 'linux'}/bedrock-server-${version}.zip`
    const response = await fetch(url)
    const buffer = await response.arrayBuffer();
    await Deno.writeFile(`bedrock-server-${version}.zip`, new Uint8Array(buffer))
}

await downloadVersion(await getVersion(System.LINUX), System.LINUX)