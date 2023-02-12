$('#dummybody').html(
  ` <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg p-3">
        <div class="container-fluid card">
            <div class="row">
                <div class="col-3 flex-column d-flex align-items-center justify-content-center">
                    <img src="" id="profilepic" class="rounded-circle mb-3" alt="">
                    <h4 id="user_name"></h4>
                    <h6 class="text-secondary mb-3" id="user_email"></h6>
                    <h5 id='logout' class="d-none cursor-pointer">Log Out <i
                            class="fa-duotone fa-right-from-bracket"></i>
                    </h5>
                </div>
                <div class="col-9">
                    <hr class='nhr m-0'>
                    <section>
                        <h5 class="p-2">Community <span class="float-end text-secondary">active users : <span
                                    id="active_users">0</span></span></h5>
                        <div class="chat-box" id='chat-msg'>
                        </div>
                        <form id='messagedata' class="typing-area">
                            <input type="text" name="message" class="input-field" id='message'
                                placeholder="Type a message here..." autocomplete="off">
                            <button id='send-data' type='button'><i
                                    class="fa-duotone fa-paper-plane-top text-white"></i></button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    </main>`
);
$('#dummybody').addClass('blur-dummy');