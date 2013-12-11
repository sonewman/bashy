
function bashy (cmd, done) {
  var child, stdo, stde, err = []
    , out = new PassThrough();

  //  set done as noop if not fn
  done = 'function' !== typeof done ? function () {} : done;

  //  create child process from cmd string
  child = exec(cmd);
  
  //  when the stdo(ut) through stream
  //  has finished writing to 'out'
  //  stream it will call done()
  stdo = out.stdout = new PassThrough();
  stdo.on('finish', done);

  //  when the stde(rr) through stream
  //  has finished writing to 'out'
  //  stream we know it has finished
  stde = out.stderr = new PassThrough();
  stde.on('finish', function () {
    //  join buffered error with line break
    //  if it is an empty string, then return
    //  undefined so as to be clear
    err = err.join('');
    if (err) done(err || undefined);
    //  this is mostly because if there is no output
    //  from a process it will write null to
    //  stderr and yet the process is likely 
    //  to have not actually errored.
  });

  //  why was i doing this again??
  // out.pipe(child.stdin);
  
  child.on('exit', function (code) {
    out.emit('exit', code);
  });

  //  bubble up errors, so they can be listen
  //  to on the return stream 
  child.on('error', function (a, b ,c) {
    out.emit('error', a, b, c);
  });

  //  pipe child process stdout and stderr to
  //  coresponding through stream and then to 'out' stream
  child.stdout.pipe(stdo).pipe(out);
  child.stderr.pipe(stde).pipe(out);

  //  on child process stderr buffer the
  //  error if the data read is not null
  child.stderr.on('data', function (chunk) {
    if (chunk !== null) err.push(chunk.toString('utf8'));
  });

  //  both stdout and stderr are piped to the
  //  same stream which is returned
  //  that way logs can just be piped
  //  from one stream only
  return out;
}