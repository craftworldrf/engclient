const fs = require("fs")
const path = require("path")




const WRITE_LIST = [
	'C:/Sandbox/User/RF_ONLINE/drive/D/RF-2.2.3.2-Client',
]

function fsReaddirFlatSync(dir) {
	return fs
		.readdirSync(dir)
		.map(f => path.join(dir, f))
		.map(f => ({
			stat: fs.lstatSync( f ),
			path: f
		}))
		.map(e => e.stat.isDirectory() ? fsReaddirFlatSync(e.path) : e)
		.flat(1e9)
}

WRITE_LIST.map(fsReaddirFlatSync).flat(1e9)
	.filter(f => !/(rflauncherupdate\.exe)|(rfex[\/\\]bin)|(rfex[\/\\]src[\/\\]autoupdate)/i.test(f.path))
	.filter(f => !/(craftworld\.exe)|(minilauncher\.localization\.ini)/i.test(f.path))
	.sort((l, r) => r.path.length - l.path.length)
	.map(f => {
		console.log(`Delelte: '${ f.path }'`)
		fs.unlinkSync(f.path)
		try {
		fs.rmdirSync(f.path)
		} catch {}
	})