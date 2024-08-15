let isFileOpen = false;
let isfileHovered = false;
let timeoutID;
let drag = false;

const openFile = (selectedId) => {
  const project = data.filter(({ id }) => id == selectedId)[0];
  isFileOpen = true;
  clearTimeout(timeoutID);

  const template = document.querySelector('template');
  const main = document.querySelector('main');

  const projectPage = template.content.cloneNode(true);

  const background = projectPage.querySelector('.background');
  const close = projectPage.querySelector('.close');
  const name = projectPage.querySelector('[name="name"]');
  const description = projectPage.querySelector('[name="description"]');
  const technologies = projectPage.querySelector('[name="technologies"]');
  const link = projectPage.querySelector('[name="link"]');
  const images = projectPage.querySelector('[name="images"]');

  name.innerText = project.name;
  description.innerText = project.description;
  technologies.innerText = project.technologies.join(", ");
  if (project.link) {
    link.querySelector('a').href = project.link;
    link.querySelector('a').innerText = project.link;
  } else {
    link.remove();
  }
  console.log(link);
  images.innerHTML = project.images.map((image) => `<img src="images/${image}"/>`).join('');

  
  const closeFile = () => {
    background.classList.add('out');
    const fileOpen = document.querySelector('.file-open');
    console.log(fileOpen, background);
    fileOpen.querySelector('.file-contents').classList.add('up');
    setTimeout(() => {
      isFileOpen = false;
      fileOpen.remove();
    }, 1000);
  }

  background.addEventListener('click', closeFile);
  close.addEventListener('click', closeFile);

  main.appendChild(projectPage);


}

const FileOfProjects = (project) => {
  return `
    <div class="folder" data-file="true" onclick="openFile(${project.id})">
  <div data-file="true" class="folder-back"></div>
  <div data-file="true" class="folder-front"></div>
  <div data-file="true" class="file-wrapper">
    <div data-file="true" class="file">
      <p data-file="true" style="font-size: 0.7em">${project.name}</p>
      <img data-file="true" src="images/${project.images[0]}" />
    </div>
  </div>
</div>
    `;
};

const DrawerBox = (text, projects) => {
  return `
    <div class="box-wrapper">
        <div class="drawer-box">
            <div class="wall-box left-box"></div>
            <div class="wall-box right-box"></div>
            <div class="wall-box back-box"></div>
            <div class="wall-box bottom-box">
            ${projects.map((project) => FileOfProjects(project)).join("")}
            </div>
            <div class="wall-box front-box">
            <div class="front-front">
                <div class="handle-front"></div>
                <div class="handle-left"></div>
                <div class="handle-right"></div>
                <div class="handle-top"></div>
                <div class="sign">
                    <p>${text}</p>
                </div>
            </div>
            <div class="left-front"></div>
            <div class="right-front"></div>
            <div class="top-front"></div>
            </div>
        </div>
    </div>
    `;
};

const Drawer = () => {
  const drawer = document.querySelector(".drawer-container");
  const drawerWrapper = document.querySelector(".drawer-wrapper");
  const projects = orderBy(data, "type");
  const rotationRangeArr = [280, 350];
  const rangeX = rotationRangeArr[1] - rotationRangeArr[0];
  const rangeY = 360;
  let animationID, animationRunning = true, isDrawerPressed = false;

  function drawerHover(e) {
    if (!e.movementX && !e.movementY) return;
    if (!drawer || !drawerWrapper) return;
    if (!isDrawerPressed || isFileOpen) {
      if (!animationRunning) {
        if (timeoutID) {
          clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(() => {

          rotateDrawer();
        }, 4000);
      }
      return;
    }

    if (animationRunning) {
      cancelAnimationFrame(animationID);
      animationRunning = false;
      timeoutID = setTimeout(() => {

        rotateDrawer();
      }, 4000);
    }

    const drawerStyles = getComputedStyle(drawer);
    const currentX = parseFloat(drawerStyles.getPropertyValue("--rotationX"));
    const currentY = parseFloat(drawerStyles.getPropertyValue("--rotationY"));

    if (isNaN(currentX) || isNaN(currentY)) return;

    const movementX = e.movementX / drawerWrapper.offsetWidth;
    const movementY = e.movementY / drawerWrapper.offsetHeight;

    let possibleX = currentX + movementY * -2 * rangeX;
    const rotationY = currentY + movementX * rangeY;

    // console.log(e.movementX, e.movementY);
    if (possibleX <= rotationRangeArr[0]) possibleX = rotationRangeArr[0];
    if (possibleX >= rotationRangeArr[1]) possibleX = rotationRangeArr[1];
    drawer.style.setProperty("--rotationX", possibleX + "deg");
    drawer.style.setProperty("--rotationY", rotationY + "deg");
    // console.log({ possibleX, movementY }, { rotationY, movementX });
    // console.log(e.movementX, e.movementY);
  }

  drawer.insertAdjacentHTML(
    "afterbegin",
    Object.keys(projects)
      .map((type) => DrawerBox(type, projects[type]))
      .join("")
  );

  const drawerBoxes = drawer.querySelectorAll('.drawer-box');
  drawerBoxes.forEach((drawerBox) => {
    drawerBox.addEventListener('mousedown', () => drag = false);
    drawerBox.addEventListener('mousemove', () => drag = true);
    drawerBox.addEventListener('click', () => drag = true);
  });

  drawerWrapper.addEventListener("mousemove", drawerHover);
  drawerWrapper.addEventListener("mousedown", () => {
    isDrawerPressed = true;
  });
  drawerWrapper.addEventListener("mouseup", (e) => {
    isDrawerPressed = false;
    if(e.target.classList.contains('drawer-box') || e.target.closest('.drawer-box')) {
      openDrawer(e);
    }
  });

  rotateDrawer();

  function rotateDrawer() {
    const desiredX = 350;
    const interval = Math.floor(1000 / 60);
    let then = Date.now();

    function animateRotation() {
      animationID = requestAnimationFrame(animateRotation);
      const elapsed = Date.now() - then;
      // console.log(elapsed);
      if (elapsed < interval) return;
      then = Date.now();
      const drawerStyles = getComputedStyle(drawer);
      const currentX = parseFloat(drawerStyles.getPropertyValue("--rotationX"));
      const currentY = parseFloat(drawerStyles.getPropertyValue("--rotationY"));

      if (isNaN(currentX) || isNaN(currentY)) return;

      let movementX = currentX;
      let movementY = currentY - 0.3;

      if (currentX < desiredX + 0.1 && currentX > desiredX - 0.1) {
        movementX = desiredX;
      } else if (currentX < desiredX) {
        movementX += 0.1;
      } else if (currentX > desiredX) {
        movementX -= 0.1;
      }
      // console.log(movementX);

      drawer.style.setProperty("--rotationX", movementX + "deg");
      drawer.style.setProperty("--rotationY", movementY + "deg");
    }
    animationRunning = true;
    requestAnimationFrame(animateRotation);
  }

  // background.addEventListener('click')
};
function openDrawer(e) {
  console.log(drag ? 'drag' : 'click');
  if(drag) return;
  if (e.target.dataset.file) return;
  const drawerBox = e.target.closest(".drawer-box");
  console.log(drawerBox);
  if (drawerBox.classList.contains("opened")) {
    drawerBox.classList.remove("opened");
    drawerBox.classList.add("closed");
  } else {
    drawerBox.classList.add("opened");
    drawerBox.classList.remove("closed");
  }
}

function orderBy(array, key) {
  let result = {};
  for (x of array) {
    if (x[key] in result) {
      result[x[key]].push(x);
    } else {
      result[x[key]] = [x];
    }
  }
  return result;
}


window.onload = Drawer;
